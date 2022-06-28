import { connectToDatabase } from '../../lib/mongodb'
import { Report } from '../../types/types';

const { db } = await connectToDatabase();

async function get(uuid: string) {
    try {
        return await db
            .collection("reports")
            .findOne({uuid})
    } catch(e) {
        throw new Error(`Failed getting report with uuid ${uuid}. reason: ${e}`)
    }
}

async function create(report: Report) {
    try {
        return await db
            .collection("reports")
            .insertOne(report)
    } catch(e) {
        throw new Error(`Failed creating report. reason: ${e}`)
    }
}

async function update(uuid: string, newReportParams: Partial<Report>) {
    try {
        await db
            .collection("reports")
            .updateOne({uuid}, {$set: newReportParams})
    } catch(e) {
        throw new Error(`Failed updating report with uuid ${uuid}. reason: ${e}`)
    }
}

async function remove(uuid: string) {
    try {
        await db
            .collection("reports")
            .deleteOne({uuid})
    } catch(e) {
        throw new Error(`Failed deleting report with uuid ${uuid}. reason: ${e}`)
    }
}

const report = {
    get,
    create,
    update,
    remove
}

export default report;