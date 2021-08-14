import React, { useContext } from "react";
import { v4 as uuidv4 } from "uuid";
// import Cryptify from "cryptify";
import { store, storage } from "../firebase";
import axios from "axios";

export const StoreContext = React.createContext();

export function useStore() {
    return useContext(StoreContext);
}






export function StoreProvider({ children }) {
    async function uploadFile(file, downloadsLeft) {
        var newfile;
        newfile = await uploadToPythonBackend(file);



        const uid = uuidv4() + "." + newfile.name.split(".").pop();
        storage.ref(uid).put(newfile);

        const { id } = await store.collection("files").add({
            uid: uid,
            fileName: newfile.name,
            downloadsLeft: downloadsLeft,
        });

        return id;
    }

    async function uploadToPythonBackend(file) {
        console.log("Going to backend");
        let formData = new FormData();
        formData.append("file", file);
        await axios.post("http://127.0.0.1:5000/pythonPDFMaker", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    }

    async function getFileURL(fileUid) {
        return await storage.ref(fileUid).getDownloadURL();
    }

    async function deleteFile(fileUid) {
        storage.ref(fileUid).delete();
    }

    const value = {
        uploadFile,
        getFileURL,
        deleteFile,
    };

    return (
        <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
    );
}
