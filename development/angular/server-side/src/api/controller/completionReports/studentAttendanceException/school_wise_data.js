const router = require('express').Router();
const { logger } = require('../../../lib/logger');
const auth = require('../../../middleware/check-auth');
const s3File = require('../../../lib/reads3File');

router.post('/schoolWise', auth.authController, async function (req, res) {
    try {
        logger.info('--- SAR Exception school wise api ---');
        var month = req.body.month;
        var year = req.body.year;
        var timePeriod = req.body.period;
        let fileName;
        if (timePeriod != null) {
            fileName = `exception_list/student_attendance_completion/${timePeriod}/school.json`;
        } else {
            fileName = `exception_list/student_attendance_completion/school_${year}_${month}.json`;
        }
        var jsonData = await s3File.readS3File(fileName);
        var schoolsAttendanceData = jsonData.data
        var schoolData = [];
        for (let i = 0; i < schoolsAttendanceData.length; i++) {
            var obj = {
                school_id: schoolsAttendanceData[i]['school_id'],
                school_name: schoolsAttendanceData[i]['school_name'],
               cluster_id: schoolsAttendanceData[i]['cluster_id'],
                cluster_name: schoolsAttendanceData[i]['cluster_name'],
                block_id: schoolsAttendanceData[i]['block_id'],
                block_name: schoolsAttendanceData[i]['block_name'],
                district_id: schoolsAttendanceData[i]['district_id'],
                district_name: schoolsAttendanceData[i]['district_name'],
                attendance: schoolsAttendanceData[i]['x_value'],
                lat: schoolsAttendanceData[i]['school_latitude'],
                lng: schoolsAttendanceData[i]['school_longitude'],
                total_schools_with_missing_data: (schoolsAttendanceData[i]['total_schools_with_missing_data']).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,"),
            }
            schoolData.push(obj);
        }
        logger.info('--- SAR Exception school wise api response sent ---');
        res.status(200).send({ schoolData: schoolData, missingSchoolsCount: jsonData.allSchoolsFooter.total_schools_with_missing_data});
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
});

router.post('/schoolPerCluster', auth.authController, async (req, res) => {
    try {
        logger.info('--- SAR Exception schoolPerCluster api ---');

        var clusterId = req.body.id;
        var month = req.body.month;
        var year = req.body.year;
        var timePeriod = req.body.period;
        let fileName;
        if (timePeriod != null) {
            fileName = `exception_list/student_attendance_completion/${timePeriod}/school.json`;
        } else {
            fileName = `exception_list/student_attendance_completion/school_${year}_${month}.json`;
        }

        var jsonData = await s3File.readS3File(fileName);
        // res.send(jsonData)
        var schoolsDetails = [];
        var filterData = jsonData.data.filter(data => {
            return (data.cluster_id == clusterId)
        });
        var schoolsAttendanceData = filterData;
        for (let i = 0; i < schoolsAttendanceData.length; i++) {
            var obj = {
                school_id: schoolsAttendanceData[i]['school_id'],
                school_name: schoolsAttendanceData[i]['school_name'],
               cluster_id: schoolsAttendanceData[i]['cluster_id'],
                cluster_name: schoolsAttendanceData[i]['cluster_name'],
                block_id: schoolsAttendanceData[i]['block_id'],
                block_name: schoolsAttendanceData[i]['block_name'],
                district_id: schoolsAttendanceData[i]['district_id'],
                district_name: schoolsAttendanceData[i]['district_name'],
                attendance: schoolsAttendanceData[i]['x_value'],
                lat: schoolsAttendanceData[i]['school_latitude'],
                lng: schoolsAttendanceData[i]['school_longitude'],
                total_schools_with_missing_data: (schoolsAttendanceData[i]['total_schools_with_missing_data']).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,"),
            }
            schoolsDetails.push(obj);
        }
        logger.info('--- SAR Exception schoolPerCluster api response sent ---');
        res.status(200).send({ schoolsDetails: schoolsDetails, missingSchoolsCount: jsonData.footer[clusterId].total_schools_with_missing_data });
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }

});

module.exports = router;