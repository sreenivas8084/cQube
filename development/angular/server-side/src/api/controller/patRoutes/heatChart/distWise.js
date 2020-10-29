const router = require('express').Router();
const { logger } = require('../../../lib/logger');
const auth = require('../../../middleware/check-auth');
const s3File = require('../../../lib/reads3File');
const helper = require('./helper');

router.post('/distWise', async (req, res) => {
    try {
        logger.info('---PAT heat map allData api ---');

        let { year, grade, subject_name, exam_date, viewBy } = req.body
        let fileName = `pat/heatChart/${year}/allData.json`
        var data = await s3File.readS3File(fileName);
        var tableData = [
            {
                "date": "29-07-2020",
                "grade": "grade3",
                "subject": "Gujarati",
                "indicator": "ચિત્રનું વર્ણન સાત આઠ વાક્યમાં લખી શકે છે.",
                "KACHCHH": "2.79",
                "BANASKANTHA": "2.84",
                "PATAN": "2.87",
                "MAHESANA": "3.37",
                "SABAR KANTHA": "2.88",
                "GANDHINAGAR": "3.18",
                "AHMEDABAD": "2.97",
                "SURENDRANAGAR": "3.12",
                "RAJKOT": "3.26",
                "JAMNAGAR": "3.31",
                "JUNAGADH": "2.73",
                "AMRELI": "3.09",
                "BHAVNAGAR": "3.27",
                "ANAND": "3.02",
                "KHEDA": "2.93",
                "PANCH MAHALS": "3.13",
                "DOHAD": "2.70",
                "VADODARA": "3.14",
                "NARMADA": "2.94",
                "BHARUCH": "3.23",
                "SURAT": "4.02",
                "THE DANGS": "3.31",
                "NAVSARI": "3.74",
                "VALSAD": "3.51",
                "TAPI": "3.39",
                "ARAVALLI": "3.10",
                "BOTAD": "2.89",
                "DEVBHOOMI DWARKA": "3.56",
                "MAHISAGAR": "3.08",
                "CHHOTAUDEPUR": "2.69",
                "MORBI": "3.12"
            },
            {
                "date": "29-07-2020",
                "grade": "grade3",
                "subject": "Gujarati",
                "indicator": "આપેલા શબ્દોનો ઉપયોગ કરી અર્થપૂર્ણ વાક્ય બનાવે છે.",
                "KACHCHH": "2.89",
                "BANASKANTHA": "2.96",
                "PATAN": "2.96",
                "MAHESANA": "3.48",
                "SABAR KANTHA": "2.98",
                "GANDHINAGAR": "3.26",
                "AHMEDABAD": "3.17",
                "SURENDRANAGAR": "3.04",
                "RAJKOT": "3.37",
                "JAMNAGAR": "3.10",
                "JUNAGADH": "2.96",
                "AMRELI": "3.23",
                "BHAVNAGAR": "3.41",
                "ANAND": "3.16",
                "KHEDA": "3.09",
                "PANCH MAHALS": "3.24",
                "DOHAD": "2.89",
                "VADODARA": "3.36",
                "NARMADA": "3.16",
                "BHARUCH": "3.33",
                "SURAT": "3.91",
                "THE DANGS": "3.38",
                "NAVSARI": "4.02",
                "VALSAD": "3.79",
                "TAPI": "3.93",
                "ARAVALLI": "3.22",
                "BOTAD": "3.12",
                "DEVBHOOMI DWARKA": "3.77",
                "MAHISAGAR": "3.34",
                "CHHOTAUDEPUR": "2.85",
                "MORBI": "3.21"
            },
            {
                "date": "29-07-2020",
                "grade": "grade3",
                "subject": "Gujarati",
                "indicator": "પરિચિત શબ્દ શોધે.",
                "KACHCHH": "2.94",
                "BANASKANTHA": "3.02",
                "PATAN": "3.02",
                "MAHESANA": "3.59",
                "SABAR KANTHA": "3.07",
                "GANDHINAGAR": "3.37",
                "AHMEDABAD": "3.35",
                "SURENDRANAGAR": "2.91",
                "RAJKOT": "3.35",
                "JAMNAGAR": "3.14",
                "JUNAGADH": "3.06",
                "AMRELI": "3.04",
                "BHAVNAGAR": "3.22",
                "ANAND": "3.28",
                "KHEDA": "3.27",
                "PANCH MAHALS": "3.50",
                "DOHAD": "2.83",
                "VADODARA": "3.62",
                "NARMADA": "3.35",
                "BHARUCH": "3.81",
                "SURAT": "3.91",
                "THE DANGS": "4.19",
                "NAVSARI": "4.13",
                "VALSAD": "3.85",
                "TAPI": "3.78",
                "ARAVALLI": "3.42",
                "BOTAD": "2.91",
                "DEVBHOOMI DWARKA": "3.70",
                "MAHISAGAR": "3.43",
                "CHHOTAUDEPUR": "3.00",
                "MORBI": "3.30"
            },
            {
                "date": "29-07-2020",
                "grade": "grade3",
                "subject": "Gujarati",
                "indicator": "નવા શબ્દ શોધે",
                "KACHCHH": "1.84",
                "BANASKANTHA": "1.79",
                "PATAN": "1.93",
                "MAHESANA": "2.34",
                "SABAR KANTHA": "1.76",
                "GANDHINAGAR": "2.04",
                "AHMEDABAD": "2.09",
                "SURENDRANAGAR": "1.86",
                "RAJKOT": "2.20",
                "JAMNAGAR": "2.18",
                "JUNAGADH": "2.05",
                "AMRELI": "2.16",
                "BHAVNAGAR": "2.24",
                "ANAND": "1.86",
                "KHEDA": "1.88",
                "PANCH MAHALS": "1.91",
                "DOHAD": "1.81",
                "VADODARA": "1.95",
                "NARMADA": "1.85",
                "BHARUCH": "2.05",
                "SURAT": "2.85",
                "THE DANGS": "2.63",
                "NAVSARI": "2.70",
                "VALSAD": "2.39",
                "TAPI": "1.89",
                "ARAVALLI": "1.95",
                "BOTAD": "1.78",
                "DEVBHOOMI DWARKA": "2.48",
                "MAHISAGAR": "2.21",
                "CHHOTAUDEPUR": "1.76",
                "MORBI": "2.00"
            },
            {
                "date": "29-07-2020",
                "grade": "grade3",
                "subject": "Gujarati",
                "indicator": "યોગ્ય જગ્યા છોડી, વિરામચિહ્નોનો ઉપયોગ કરી શુદ્ધ રીતે લખે.",
                "KACHCHH": "2.67",
                "BANASKANTHA": "2.69",
                "PATAN": "2.66",
                "MAHESANA": "3.17",
                "SABAR KANTHA": "2.57",
                "GANDHINAGAR": "2.99",
                "AHMEDABAD": "2.97",
                "SURENDRANAGAR": "2.80",
                "RAJKOT": "3.14",
                "JAMNAGAR": "3.21",
                "JUNAGADH": "2.74",
                "AMRELI": "3.01",
                "BHAVNAGAR": "3.10",
                "ANAND": "2.86",
                "KHEDA": "2.70",
                "PANCH MAHALS": "3.09",
                "DOHAD": "2.55",
                "VADODARA": "2.92",
                "NARMADA": "2.73",
                "BHARUCH": "2.69",
                "SURAT": "2.87",
                "THE DANGS": "3.69",
                "NAVSARI": "3.72",
                "VALSAD": "3.49",
                "TAPI": "3.95",
                "ARAVALLI": "2.68",
                "BOTAD": "2.72",
                "DEVBHOOMI DWARKA": "3.32",
                "MAHISAGAR": "2.62",
                "CHHOTAUDEPUR": "2.44",
                "MORBI": "3.07"
            },
            {
                "date": "29-07-2020",
                "grade": "grade3",
                "subject": "Maths",
                "indicator": "સીધી રેખાઓનો ઉપયોગ કરીને, ત્રુટક રેખા પરથી કાગળ કાપીને, કાગળને ગળી પાડીને... વગેરે દ્વારા દ્વિ-પરિમાણીય (2 D) આકારો બનાવે અને ઓળખે છે.",
                "KACHCHH": "3.58",
                "BANASKANTHA": "3.66",
                "PATAN": "3.66",
                "MAHESANA": "4.06",
                "SABAR KANTHA": "3.70",
                "GANDHINAGAR": "3.94",
                "AHMEDABAD": "3.94",
                "SURENDRANAGAR": "3.71",
                "RAJKOT": "3.95",
                "JAMNAGAR": "3.28",
                "JUNAGADH": "3.58",
                "AMRELI": "3.80",
                "BHAVNAGAR": "3.93",
                "ANAND": "3.80",
                "KHEDA": "3.81",
                "PANCH MAHALS": "4.29",
                "DOHAD": "3.59",
                "VADODARA": "3.99",
                "NARMADA": "3.97",
                "BHARUCH": "4.28",
                "SURAT": "4.25",
                "THE DANGS": "4.13",
                "NAVSARI": "4.40",
                "VALSAD": "4.36",
                "TAPI": "4.55",
                "ARAVALLI": "3.95",
                "BOTAD": "3.64",
                "DEVBHOOMI DWARKA": "4.29",
                "MAHISAGAR": "3.93",
                "CHHOTAUDEPUR": "3.65",
                "MORBI": "3.96"
            },
            {
                "date": "29-07-2020",
                "grade": "grade4",
                "subject": "Gujarati",
                "indicator": "પરિચિત કે અપરિચિત વિષય પર સ્વતંત્ર લેખન કરી શકે છે.",
                "KACHCHH": "2.95",
                "BANASKANTHA": "2.99",
                "PATAN": "3.00",
                "MAHESANA": "3.41",
                "SABAR KANTHA": "3.03",
                "GANDHINAGAR": "3.28",
                "AHMEDABAD": "3.18",
                "SURENDRANAGAR": "3.14",
                "RAJKOT": "3.40",
                "JAMNAGAR": "3.34",
                "JUNAGADH": "3.15",
                "AMRELI": "3.24",
                "BHAVNAGAR": "3.42",
                "ANAND": "3.23",
                "KHEDA": "3.14",
                "PANCH MAHALS": "3.46",
                "DOHAD": "3.04",
                "VADODARA": "3.35",
                "NARMADA": "3.15",
                "BHARUCH": "3.20",
                "SURAT": "3.66",
                "THE DANGS": "3.73",
                "NAVSARI": "3.77",
                "VALSAD": "3.59",
                "TAPI": "3.71",
                "ARAVALLI": "3.27",
                "BOTAD": "3.47",
                "DEVBHOOMI DWARKA": "3.79",
                "MAHISAGAR": "3.37",
                "CHHOTAUDEPUR": "3.03",
                "MORBI": "3.34"
            },
            {
                "date": "29-07-2020",
                "grade": "grade4",
                "subject": "Maths",
                "indicator": "બે વસ્તુઓ વચ્ચેના અંતર, જુદી જુદી વસ્તુઓનું વજન, વસ્તુઓની ગુંજાશ અવ્ગેરેનો અંદાજ લગાવે છે અને તેમનું ચોક્કસ માપન કરે છે.",
                "KACHCHH": "2.74",
                "BANASKANTHA": "2.81",
                "PATAN": "2.88",
                "MAHESANA": "3.23",
                "SABAR KANTHA": "2.97",
                "GANDHINAGAR": "3.06",
                "AHMEDABAD": "3.02",
                "SURENDRANAGAR": "2.88",
                "RAJKOT": "3.17",
                "JAMNAGAR": "2.55",
                "JUNAGADH": "2.81",
                "AMRELI": "2.91",
                "BHAVNAGAR": "3.10",
                "ANAND": "3.01",
                "KHEDA": "3.01",
                "PANCH MAHALS": "3.37",
                "DOHAD": "3.02",
                "VADODARA": "3.32",
                "NARMADA": "3.11",
                "BHARUCH": "3.29",
                "SURAT": "3.17",
                "THE DANGS": "4.55",
                "NAVSARI": "3.64",
                "VALSAD": "3.59",
                "TAPI": "3.61",
                "ARAVALLI": "3.12",
                "BOTAD": "3.10",
                "DEVBHOOMI DWARKA": "3.53",
                "MAHISAGAR": "3.27",
                "CHHOTAUDEPUR": "3.01",
                "MORBI": "3.16"
            },
            {
                "date": "29-07-2020",
                "grade": "grade5",
                "subject": "Gujarati",
                "indicator": "પરિચિત કે અપરિચિત વિષય પર સ્વતંત્ર લેખન કરી શકે છે.",
                "KACHCHH": "1.95",
                "BANASKANTHA": "1.92",
                "PATAN": "1.98",
                "MAHESANA": "2.36",
                "SABAR KANTHA": "2.18",
                "GANDHINAGAR": "2.14",
                "AHMEDABAD": "2.12",
                "SURENDRANAGAR": "2.01",
                "RAJKOT": "2.41",
                "JAMNAGAR": "2.12",
                "JUNAGADH": "2.18",
                "AMRELI": "2.38",
                "BHAVNAGAR": "2.32",
                "ANAND": "2.15",
                "KHEDA": "2.11",
                "PANCH MAHALS": "2.18",
                "DOHAD": "1.82",
                "VADODARA": "2.14",
                "NARMADA": "2.29",
                "BHARUCH": "2.02",
                "SURAT": "2.63",
                "THE DANGS": "1.88",
                "NAVSARI": "2.87",
                "VALSAD": "2.61",
                "TAPI": "2.31",
                "ARAVALLI": "2.34",
                "BOTAD": "2.49",
                "DEVBHOOMI DWARKA": "2.60",
                "MAHISAGAR": "2.38",
                "CHHOTAUDEPUR": "2.18",
                "MORBI": "2.10"
            },
            {
                "date": "29-07-2020",
                "grade": "grade5",
                "subject": "Maths",
                "indicator": "આસપાસના પર્યાવરણમાં રચાતા ખૂણાઓને કાટકોણ, લઘુકોણ અને ગુરુકોણ સ્વરૂપે દર્શાવે છે.",
                "KACHCHH": "3.22",
                "BANASKANTHA": "3.32",
                "PATAN": "3.33",
                "MAHESANA": "3.77",
                "SABAR KANTHA": "3.45",
                "GANDHINAGAR": "3.55",
                "AHMEDABAD": "3.67",
                "SURENDRANAGAR": "3.32",
                "RAJKOT": "3.60",
                "JAMNAGAR": "3.07",
                "JUNAGADH": "3.33",
                "AMRELI": "3.35",
                "BHAVNAGAR": "3.45",
                "ANAND": "3.51",
                "KHEDA": "3.56",
                "PANCH MAHALS": "3.96",
                "DOHAD": "3.61",
                "VADODARA": "3.67",
                "NARMADA": "3.54",
                "BHARUCH": "3.75",
                "SURAT": "3.88",
                "THE DANGS": "3.24",
                "NAVSARI": "4.02",
                "VALSAD": "3.99",
                "TAPI": "3.82",
                "ARAVALLI": "3.67",
                "BOTAD": "3.59",
                "DEVBHOOMI DWARKA": "3.85",
                "MAHISAGAR": "3.78",
                "CHHOTAUDEPUR": "3.43",
                "MORBI": "3.50"
            },
            {
                "date": "29-07-2020",
                "grade": "grade6",
                "subject": "Gujarati",
                "indicator": "પરિચિત પ્રસંગો સ્થળો અને પરિસ્થિતિનું વર્ણન કરી શકે છે .",
                "KACHCHH": "2.77",
                "BANASKANTHA": "2.68",
                "PATAN": "2.73",
                "MAHESANA": "3.15",
                "SABAR KANTHA": "2.76",
                "GANDHINAGAR": "2.80",
                "AHMEDABAD": "2.79",
                "SURENDRANAGAR": "3.20",
                "RAJKOT": "3.28",
                "JAMNAGAR": "3.37",
                "JUNAGADH": "2.85",
                "AMRELI": "3.11",
                "BHAVNAGAR": "3.10",
                "ANAND": "2.72",
                "KHEDA": "2.62",
                "PANCH MAHALS": "2.47",
                "DOHAD": "2.74",
                "VADODARA": "2.73",
                "NARMADA": "2.81",
                "BHARUCH": "2.78",
                "SURAT": "2.98",
                "THE DANGS": "3.64",
                "NAVSARI": "3.47",
                "VALSAD": "3.28",
                "TAPI": "3.14",
                "ARAVALLI": "2.90",
                "BOTAD": "3.43",
                "DEVBHOOMI DWARKA": "3.55",
                "MAHISAGAR": "2.67",
                "CHHOTAUDEPUR": "2.59",
                "MORBI": "3.02"
            },
            {
                "date": "29-07-2020",
                "grade": "grade6",
                "subject": "Maths",
                "indicator": "પૂર્ણ સંખ્યા વિશેના સરવાળા અને ગુણાકારના ગુણધર્મો જણાવે છે તેમજ ગુણધર્મનો ઉપયોગ કરી  ગણતરી કરે છે.",
                "KACHCHH": "2.15",
                "BANASKANTHA": "2.02",
                "PATAN": "2.13",
                "MAHESANA": "2.54",
                "SABAR KANTHA": "2.16",
                "GANDHINAGAR": "2.22",
                "AHMEDABAD": "2.12",
                "SURENDRANAGAR": "2.20",
                "RAJKOT": "2.42",
                "JAMNAGAR": "2.29",
                "JUNAGADH": "2.05",
                "AMRELI": "2.20",
                "BHAVNAGAR": "2.25",
                "ANAND": "2.12",
                "KHEDA": "2.07",
                "PANCH MAHALS": "2.11",
                "DOHAD": "2.02",
                "VADODARA": "2.49",
                "NARMADA": "2.11",
                "BHARUCH": "2.64",
                "SURAT": "2.32",
                "THE DANGS": "1.00",
                "NAVSARI": "2.65",
                "VALSAD": "2.62",
                "TAPI": "2.45",
                "ARAVALLI": "2.36",
                "BOTAD": "2.07",
                "DEVBHOOMI DWARKA": "2.37",
                "MAHISAGAR": "2.45",
                "CHHOTAUDEPUR": "2.09",
                "MORBI": "2.08"
            },
            {
                "date": "29-07-2020",
                "grade": "grade7",
                "subject": "Gujarati",
                "indicator": "ચિત્ર વર્ણન અને લખી શકશે .",
                "KACHCHH": "2.33",
                "BANASKANTHA": "2.26",
                "PATAN": "2.18",
                "MAHESANA": "2.70",
                "SABAR KANTHA": "2.32",
                "GANDHINAGAR": "2.33",
                "AHMEDABAD": "2.26",
                "SURENDRANAGAR": "2.35",
                "RAJKOT": "2.69",
                "JAMNAGAR": "2.65",
                "JUNAGADH": "2.40",
                "AMRELI": "2.57",
                "BHAVNAGAR": "2.61",
                "ANAND": "2.17",
                "KHEDA": "2.12",
                "PANCH MAHALS": "1.78",
                "DOHAD": "2.12",
                "VADODARA": "2.43",
                "NARMADA": "2.11",
                "BHARUCH": "2.30",
                "SURAT": "2.38",
                "NAVSARI": "2.64",
                "VALSAD": "2.71",
                "TAPI": "2.76",
                "ARAVALLI": "2.34",
                "BOTAD": "2.74",
                "DEVBHOOMI DWARKA": "3.00",
                "MAHISAGAR": "2.35",
                "CHHOTAUDEPUR": "2.13",
                "MORBI": "2.44"
            },
            {
                "date": "29-07-2020",
                "grade": "grade7",
                "subject": "Maths",
                "indicator": "દશાંશ સંખ્યાના પૂર્ણ સંખ્યા સાથે ગુણાકાર કરે છે .",
                "KACHCHH": "3.45",
                "BANASKANTHA": "3.42",
                "PATAN": "3.48",
                "MAHESANA": "3.83",
                "SABAR KANTHA": "3.62",
                "GANDHINAGAR": "3.59",
                "AHMEDABAD": "3.60",
                "SURENDRANAGAR": "3.45",
                "RAJKOT": "3.70",
                "JAMNAGAR": "3.32",
                "JUNAGADH": "3.40",
                "AMRELI": "3.40",
                "BHAVNAGAR": "3.58",
                "ANAND": "3.49",
                "KHEDA": "3.59",
                "PANCH MAHALS": "3.45",
                "DOHAD": "3.71",
                "VADODARA": "3.93",
                "NARMADA": "3.76",
                "BHARUCH": "3.76",
                "SURAT": "4.11",
                "NAVSARI": "3.91",
                "VALSAD": "4.10",
                "TAPI": "3.88",
                "ARAVALLI": "3.81",
                "BOTAD": "3.26",
                "DEVBHOOMI DWARKA": "4.10",
                "MAHISAGAR": "3.85",
                "CHHOTAUDEPUR": "3.53",
                "MORBI": "3.66"
            },
            {
                "date": "29-07-2020",
                "grade": "grade8",
                "subject": "Gujarati",
                "indicator": "ગદ્યાંશ પરથી સારાંશ, શીર્ષક પરથી વાર્તા જેવા લેખોનું સર્જન કરી શકે છે.",
                "KACHCHH": "2.79",
                "BANASKANTHA": "2.73",
                "PATAN": "2.75",
                "MAHESANA": "3.14",
                "SABAR KANTHA": "2.76",
                "GANDHINAGAR": "2.80",
                "AHMEDABAD": "2.70",
                "SURENDRANAGAR": "2.84",
                "RAJKOT": "3.19",
                "JAMNAGAR": "2.96",
                "JUNAGADH": "2.80",
                "AMRELI": "3.14",
                "BHAVNAGAR": "3.16",
                "ANAND": "2.66",
                "KHEDA": "2.61",
                "PANCH MAHALS": "2.52",
                "DOHAD": "2.70",
                "VADODARA": "2.84",
                "NARMADA": "2.57",
                "BHARUCH": "3.13",
                "SURAT": "3.04",
                "NAVSARI": "3.10",
                "VALSAD": "3.12",
                "TAPI": "3.28",
                "ARAVALLI": "2.69",
                "BOTAD": "3.27",
                "DEVBHOOMI DWARKA": "3.38",
                "MAHISAGAR": "2.67",
                "CHHOTAUDEPUR": "2.59",
                "MORBI": "2.96"
            },
            {
                "date": "29-07-2020",
                "grade": "grade8",
                "subject": "Maths",
                "indicator": "એકચલ સુરેખ સમીકરણ સંબંધી વ્યવહારૂ કોયડા ઉકેલે છે.",
                "KACHCHH": "3.11",
                "BANASKANTHA": "3.08",
                "PATAN": "3.17",
                "MAHESANA": "3.55",
                "SABAR KANTHA": "3.22",
                "GANDHINAGAR": "3.28",
                "AHMEDABAD": "3.18",
                "SURENDRANAGAR": "3.17",
                "RAJKOT": "3.39",
                "JAMNAGAR": "2.84",
                "JUNAGADH": "2.99",
                "AMRELI": "3.15",
                "BHAVNAGAR": "3.27",
                "ANAND": "3.12",
                "KHEDA": "3.20",
                "PANCH MAHALS": "3.20",
                "DOHAD": "3.51",
                "VADODARA": "3.53",
                "NARMADA": "3.21",
                "BHARUCH": "3.42",
                "SURAT": "3.29",
                "NAVSARI": "3.50",
                "VALSAD": "3.69",
                "TAPI": "3.82",
                "ARAVALLI": "3.31",
                "BOTAD": "3.31",
                "DEVBHOOMI DWARKA": "3.30",
                "MAHISAGAR": "3.30",
                "CHHOTAUDEPUR": "3.18",
                "MORBI": "3.37"
            }
        ]
        let districtDetails = data.map(e => {
            return {
                district_id: e.district_id,
                district_name: e.district_name
            }
        })

        districtDetails = districtDetails.reduce((unique, o) => {
            if (!unique.some(obj => obj.district_id === o.district_id)) {
                unique.push(o);
            }
            return unique;
        }, []);

        if (grade) {
            data = data.filter(val => {
                return val.grade == grade
            })
        }
        if (subject_name) {
            data = data.filter(val => {
                return val.subject_name == subject_name
            })
        }
        if (exam_date) {
            data = data.filter(val => {
                return val.exam_date == exam_date
            })
        }

        data = data.sort((a, b) => (a.district_name) > (b.district_name) ? 1 : -1)
        let result = await helper.generalFun(data, 0, viewBy)

        logger.info('--- PAT heat map allData response sent ---');

        res.status(200).send({ districtDetails, result, downloadData: data, tableData });
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
});

module.exports = router