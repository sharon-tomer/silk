import { NextApiRequest, NextApiResponse } from 'next'
import report from '../../../db/report/index'
export default handler;

function handler(req: NextApiRequest, res: NextApiResponse) {
    const {
        query: { uuid },
        method
      } = req

    if(Array.isArray(uuid)) return res.status(405).json(buildErrorResponse(`Bulk operations are not supported`))

    switch (method) {
        case 'GET':
            return handleGet(uuid);
        case 'PUT':
            return createReportAtomically();
        case 'PATCH':
            return handlePatch(uuid);
        case 'DELETE':
            return deleteReport();
        default:
            return res.status(405).json(buildErrorResponse(`Method ${req.method} Not Allowed`))
    }

    function handleGet(uuid: string) {
        try {
            const result = report.get(uuid);
            return res.status(200).json(result);
        } catch(e) {
            return res.status(500).json(buildErrorResponse(`failed to get report. db returned error: ${e}`));
        }
    }

    function handlePatch(uuid: string) {
        try {
            const modifiedReport = report.update(uuid, req.body); // needs sanitization
            return res.status(200).json(modifiedReport);
        } catch (e) {
            return res.status(500).json(buildErrorResponse(`failed to get report. db returned error: ${e}`));
        }
    }

    function deleteReport() {
        usersRepo.delete(req.query.id);
        return res.status(200).json({});
    }

    function buildErrorResponse(message: string) {
        return {
            "code": 0,
            message
        }
    }
}