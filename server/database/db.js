// =========================================================== Setup
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");
const firebaseStorage = require("firebase-admin/storage");
const fs = require('fs');
const { formatBase64 } = require("../Utils/util");



const firebaseConfig = {
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "tithenai-23867.appspot.com"
}

const firebseApp = admin.initializeApp(firebaseConfig);
const db = admin.firestore();
const storage = firebaseStorage.getStorage(firebseApp);

//=========================================================== collection names 
const USERS = 'users';
const UNIS = 'universities';
const THESES = 'theses';
const REPORTS = 'reports';
const REVIEWS = 'reviews';
const BUCKETNAME = 'tithenai-23867.appspot.com'

const DEFAULT_UNI = {
    uniCountry: "",
    uniName: "",
    uniState: "",
    uniTheses: "",
    uniType: "",
    uniUrl: ""
}
// =========================================================== Manage Users

async function addNewUser(data) {
    uid = data.uid
    idToken = data.idToken
    dbUserData = {
        userUniversityID: data.userdata.userUniversityID,
        userAcademicStatus: data.userdata.userAcademicStatus,
        userFirstname: data.userdata.userFirstname,
        userLastname: data.userdata.userLastname,
        userGender: data.userdata.userGender,
        userTheses: [], // first time adding a user, no theses yet.
        userAdmin: false,
        userReports: [],
    }

    // When user try to authenticate with google, they might exist in the database
    // Check if the user exist before adding any new data

    return db
        .collection(USERS)
        .doc(uid)
        .get()
        .then((doc) => {
            return db
                .collection(USERS)
                .doc(uid)
                .set(dbUserData)
                .then(() => true)
                .catch((error) => {
                    console.log(error);
                    return false;
                })
        }).catch((error) => {
            console.log(error);
            return false;
        })
}

async function getUserInfo(uid) {
    return db.collection(USERS).doc(uid)
        .get()
        .then(async (doc) => {
            const authUserData = await admin.auth().getUser(uid)
            const firebaseUserData = doc.data()
            const uniID = firebaseUserData.userUniversityID
            const userThesesIds = firebaseUserData.userTheses

            // getting the uni of the user
            let uni = DEFAULT_UNI
            if (uniID) {
                const uniSnapshot = await db.collection(UNIS).doc(uniID).get();
                uni = {
                    uniId: uniID,
                    ...uniSnapshot.data()
                }
            }

            // getting the theses of the user
            let theses = [];
            for (const thesisId of userThesesIds) {
                const thesissnapshot = await db.collection(THESES).doc(thesisId).get();
                theses.push(thesissnapshot.data())
            }

            delete firebaseUserData.uniId
            delete firebaseUserData.userTheses

            const userInfo = {
                ...firebaseUserData,
                userEmail: authUserData.email,
                userPhotoURL: authUserData.photoURL,
                userUniversity: uni,
                userTheses: theses
            }
            return userInfo;
        }).catch((error) => {
            console.log(error);
            return false;
        })
}

function deleteAllUsers(nextPageToken) {
    let uids = [];
    admin
        .auth()
        .listUsers(100, nextPageToken)
        .then((listUsersResult) => {
            uids = uids.concat(listUsersResult.users.map((userRecord) => userRecord.uid));
            console.log(uids);
            admin.auth().deleteUsers(uids);
        });

    db.collection(USERS)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                doc.ref.delete();
            });
        });
}

async function updateUser(newUserData) {

    async function updateNameInCollection(collectionName, uid, userIDField, userNameField) {
        const docs = await db.collection(collectionName).where(userIDField, '==', uid).get();
        docs.forEach(async doc => {
            await db.collection(collectionName)
                .doc(doc.id)
                .update({
                    [userNameField]: `${newUserData.userFirstname} ${newUserData.userLastname}`,
                })
        });
    }

    try {
        // 1. update user data in the users collcection
        await db.collection(USERS)
            .doc(newUserData.uid)
            .update({
                userFirstname: newUserData.userFirstname,
                userLastname: newUserData.userLastname,
                userAcademicStatus: newUserData.userAcademicStatus,
                userUniversityID: newUserData.userUniversityID
            })

        // 2. update user name in reports collection
        await updateNameInCollection(REPORTS, newUserData.uid, 'reportReporterID', "reporterName");

        // 3. update user name in reviews collection
        await updateNameInCollection(REVIEWS, newUserData.uid, 'reviewAuthorID', "reviewAuthorName");

        // 4. update user name in theses collection 
        await updateNameInCollection(THESES, newUserData.uid, 'thesisAutherID', "thesisAuthorName");

        // 5. update user data in auth
        admin.auth()
            .updateUser(newUserData.uid, {
                email: newUserData.userEmail,
                emailVerified: false,
            })

    } catch (error) {
        console.log(error);
        return false;
    }
    return true;
}

async function updateUserImage(data) {
    try {
        const uid = data.uid;
        const imageBase64 = formatBase64(data.imageBase64)
        const buf = new Buffer.from(imageBase64, 'base64');
        const file = storage.bucket(BUCKETNAME).file(`userImages/${uid}.png`);
        await file.save(buf);
        const publicUrl = await file.getSignedUrl({
            action: 'read',
            expires: '03-17-2025', // TODO: make this dynamic 
        });
        admin.auth()
            .updateUser(uid, {
                photoURL: publicUrl[0]
            })
        return true
    } catch (error) {
        console.log(error);
        return false;
    }
}
// =========================================================== Universities

async function getAllUnis() {
    try {
        const querySnapshot = await db.collection(UNIS)
            .orderBy("uniName", "asc")
            .get();

        unis = []
        let counter = 0;
        querySnapshot.forEach((doc) => {
            const uniImgRef = storage.bucket(BUCKETNAME).file(`uniImages/${doc.id}.png`)
            const uniImageUrl = uniImgRef.publicUrl();
            uni = {
                ...doc.data(),
                uniId: doc.id,
                uniImageUrl: uniImageUrl
            }
            unis.push(uni)
        });
        return unis;
    } catch (error) {
        console.log(error);
        return false;
    }
}

async function uploadUniImages() {
    fileNames = fs.readdirSync('database/uniImages/');
    fileNames.forEach(async (filename) => {
        await storage.bucket(BUCKETNAME).upload("database/uniImages/" + filename, {
            destination: "uniImages/" + filename,
        });
    });
}

// =========================================================== Theses

async function getAllTheses() {
    return db
        .collection(THESES)
        .orderBy("thesisTitle", "asc")
        .get()
        .then((querySnapshot) => {
            const theses = []
            querySnapshot.forEach((doc) => {
                thesis = {
                    ...doc.data(),
                    thesisId: doc.id
                }
                theses.push(thesis)
            });
            return theses;
        }).catch((error) => {
            console.log(error);
            return false;
        })
}

async function uploadThesis(data) {
    const uid = data.thesisAutherID;
    // const thesisPdfBase64 = data.thesisPdfBase64;
    const thesis = { ...data, thesisPdfUrl: "" };
    thesis.thesisUploadDate = new Date(thesis.thesisUploadDate)
    thesis.thesisDate = new Date(thesis.thesisDate)
    delete thesis.thesisPdfBase64;
    try {
        // add new thesis 
        const addedThesis = await db.collection(THESES).add(thesis)

        // TODO: get a real pdf file as Base64
        const pdfFile = await fs.readFileSync('database/myThesis.pdf', 'base64');
        const buf = new Buffer.from(pdfFile, 'base64');
        const file = storage.bucket(BUCKETNAME).file(`theses/${addedThesis.id}.pdf`);
        await file.save(buf);
        const publicUrl = await file.getSignedUrl({
            action: 'read',
            expires: '03-09-2491', 
        });

        // update document with the url
        await db.collection(THESES).doc(addedThesis.id).update({
            thesisPdfUrl: publicUrl
        })

    } catch (error) {
        console.log(error);
        return false;
    }
    return true
}


// =========================================================== Exports

module.exports.deleteAllUsers = deleteAllUsers;
module.exports.addNewUser = addNewUser;
module.exports.getAllUnis = getAllUnis;
module.exports.updateUser = updateUser;
module.exports.getAllTheses = getAllTheses;
module.exports.getUserInfo = getUserInfo;
module.exports.uploadUniImages = uploadUniImages;
module.exports.updateUserImage = updateUserImage;
module.exports.uploadThesis = uploadThesis;