#!/usr/bin/python

import sys, json, io

from mitie import *
from collections import defaultdict

MITIE_MODELS_PATH = "./MITIE-models/model.dat"

input_stream = io.TextIOWrapper(sys.stdin.buffer, encoding='utf-8')

if __name__=='__main__':
    # lang = sys.argv[1]
    model_name = sys.argv[1]
    ner = named_entity_extractor(model_name)
    input_json = None
    for line in input_stream:
        input_json = json.loads(line)
        method = input_json['method']
        output = None
        if method == 'get_possible_ner_tags':
            tags = ner.get_possible_ner_tags()
            output = {"request": input_json, "response":{ "tags": tags } }
        else:
            text = input_json['params']['text']
            text = to_bytes(text)
            if method == 'tokenize':
                offsets = input_json['params']['offsets']
                if (offsets != "true"):
                    output = tokenize(text)
                    output = [str(x.decode('UTF-8')) for x in output]
                else:
                    output = tokenize_with_offsets(text)
                    output = [(str(x.decode('UTF-8')), y) for (x, y) in output]
                output = {"request": input_json,"response":{ "tokens": output } }
            elif method == 'extract_entities':
                tags = input_json['params']['tags']
                if tags == '':
                    tags = ner.get_possible_ner_tags()
                output = []
                tokens = tokenize(text)
                entities = ner.extract_entities(tokens)
                for e in entities:
                    tag = e[1]
                    if (tag in tags):
                        range = e[0]
                        score = e[2]
                        score_text = "{:0.3f}".format(score)
                        entity_text = " ".join(tokens[i].decode() for i in range)
                        obj = {
                            "score": score_text,
                            "tag": tag,
                            "entity": entity_text,
                            "range": {
                                "start": min(range),
                                "end": max(range)
                            }
                        }
                        output.append(obj)
                output = {"request": input_json,"response":{ "named_entities": output}}
        output_json = json.dumps(output, ensure_ascii=False).encode('utf-8')
        sys.stdout.buffer.write(output_json)
        print()
