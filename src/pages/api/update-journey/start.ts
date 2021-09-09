// import {
//   BeaconsApiRequest,
//   withApiContainer,
// } from "../../../lib/middleware/withApiContainer";
//
// export const handler = withApiContainer(async (req: BeaconsApiRequest, res) => {
//   const {
//     getAccountHoldersRegistration,
//     getAccountHolderId,
//     saveDraftRegistration,
//   } = req.container;
//   const { submissionId } = req.cookies;
//   const { redirectUri, id } = req.query; // url?redirectUri=/
//
//   await addNewUseToDraftRegistration(submissionId);
//   const newUseIndex =
//     (await getDraftRegistration(submissionId)).uses.length - 1;
//
//   res.redirect(redirectUri);
// });
//
// export default handler;
