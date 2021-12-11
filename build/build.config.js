const path = require("path")

module.exports = {
	models: {
		destDir: path.resolve( __dirname, '../MITIE-models'),
		source:{
			en: {
				name:'English',
				title:"Jace NER Service for English language",
				description:"Provides API for Named Entity Recognition of English language. Part of Jace NLP service. Functionality of this service is based on MITIE SVM.",
				dest: "en_model.zip",
				url: [
					"https://raw.githubusercontent.com/boldak/MITIE-NER-models/main/en/en_model.zip.sf-part1",
					"https://raw.githubusercontent.com/boldak/MITIE-NER-models/main/en/en_model.zip.sf-part2",
					"https://raw.githubusercontent.com/boldak/MITIE-NER-models/main/en/en_model.zip.sf-part3",
					"https://raw.githubusercontent.com/boldak/MITIE-NER-models/main/en/en_model.zip.sf-part4",
					"https://raw.githubusercontent.com/boldak/MITIE-NER-models/main/en/en_model.zip.sf-part5"
				]
			},

			uk: {
				name:'Ukrainian',
				title:"Jace NER Service for Ukrainian language",
				description:"Provides API for Named Entity Recognition of Ukrainian language. Part of Jace NLP service. Functionality of this service is based on MITIE SVM.",
				dest: "uk_model.zip",
				url: [
					"https://raw.githubusercontent.com/boldak/MITIE-NER-models/main/uk/uk_model.zip.sf-part1",
					"https://raw.githubusercontent.com/boldak/MITIE-NER-models/main/uk/uk_model.zip.sf-part2",
					"https://raw.githubusercontent.com/boldak/MITIE-NER-models/main/uk/uk_model.zip.sf-part3",
					"https://raw.githubusercontent.com/boldak/MITIE-NER-models/main/uk/uk_model.zip.sf-part4",
					"https://raw.githubusercontent.com/boldak/MITIE-NER-models/main/uk/uk_model.zip.sf-part5"
				]
			},

			ru: {
				name:'Russian',
				title:"Jace NER Service for Russian language",
				description:"Provides API for Named Entity Recognition of Russian language. Part of Jace NLP service. Functionality of this service is based on MITIE SVM.",
				dest: "ru_model.zip",
				url: [
					"https://raw.githubusercontent.com/boldak/MITIE-NER-models/main/ru/ru_model.zip.sf-part1",
					"https://raw.githubusercontent.com/boldak/MITIE-NER-models/main/ru/ru_model.zip.sf-part2",
					"https://raw.githubusercontent.com/boldak/MITIE-NER-models/main/ru/ru_model.zip.sf-part3",
					"https://raw.githubusercontent.com/boldak/MITIE-NER-models/main/ru/ru_model.zip.sf-part4",
					"https://raw.githubusercontent.com/boldak/MITIE-NER-models/main/ru/ru_model.zip.sf-part5"
				]
			}
		}
	}
}
