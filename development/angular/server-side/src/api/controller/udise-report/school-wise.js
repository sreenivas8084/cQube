const router = require('express').Router();
const { logger } = require('../../lib/logger');
const auth = require('../../middleware/check-auth');
const s3File = require('../../lib/reads3File');

router.post('/allSchoolWise', auth.authController, async (req, res) => {
    try {
        // logger.info('---Infra cluster wise api ---');
        // let fileName = `infra/infra_cluster_map.json`;
        // var clusterData = await s3File.readS3File(fileName);
        // var mydata = clusterData.data;
        var mydata = [
            {
                details: {
                    district_id: 2401,
                    district_name: "Kachchh",
                    block_id: 240101,
                    block_name: "Lakhapat",
                    cluster_id: 2401010001,
                    cluster_name: "Baranda",
                    school_id: 24010104801,
                    school_name: "Zumara Primary Shala",
                    "latitude": 23.6720399,
                    "longitude": 69.078736111,
                    district_rank: 4,
                    block_rank: 3,
                    cluster_rank: 2,
                    school_rank: 1
                },
                metrics: {
                    enrolment: 10,
                    school_operation: 10101,
                    policy_implementation: 101,
                    infrastructure: 60,
                    school_inspection: 100,
                    community_participation: 1000,
                    teacher_profile: "",
                    school_performance: 58,
                    grant_expenditure: 70,
                    vocational_education: 80,
                    NEP: 75,
                    school_infrastructure_score: 50
                }
            }
        ]
        logger.info('---Infra cluster wise api response sent---');
        res.status(200).send({ data: mydata, footer: 150 });
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
});

router.post('/schoolWise/:distId/:blockId/:clusterId', auth.authController, async (req, res) => {
    try {
        // logger.info('---Infra clusterperBlock api ---');
        // let fileName = `infra/infra_cluster_map.json`;
        // var clusterData = await s3File.readS3File(fileName);
        var clusterData = {
            data: [
                {
                    details: {
                        district_id: 2401,
                        district_name: "Kachchh",
                        block_id: 240101,
                        block_name: "Lakhapat",
                        cluster_id: 2401010001,
                        cluster_name: "Baranda",
                        school_id: 24010104801,
                        school_name: "Zumara Primary Shala",
                        "latitude": 23.6720399,
                        "longitude": 69.078736111,
                        district_rank: 4,
                        block_rank: 3,
                        cluster_rank: 2,
                        school_rank: 1
                    },
                    metrics: {
                        enrolment: 10,
                        school_operation: 10101,
                        policy_implementation: 101,
                        infrastructure: 60,
                        school_inspection: 100,
                        community_participation: 1000,
                        teacher_profile: "",
                        school_performance: 58,
                        grant_expenditure: 70,
                        vocational_education: 80,
                        NEP: 75,
                        school_infrastructure_score: 50
                    }
                }
            ]
        }


        let distId = req.params.distId;
        let blockId = req.params.blockId;

        let filterData = clusterData.data.filter(obj => {
            return (obj.details.district_id == distId && obj.details.block_id == blockId)
        })
        let mydata = filterData;
        logger.info('---Infra clusterperBlock api response sent---');
        res.status(200).send({ data: mydata, footer: 20 });


    } catch (e) {
        logger.error(e);
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
})


module.exports = router;