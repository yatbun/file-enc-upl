import React, { useContext } from "react";
import { v4 as uuidv4 } from "uuid";
import { AES } from "crypto-js";

import { store, storage } from "../firebase";

export const StoreContext = React.createContext();

export function useStore() {
    return useContext(StoreContext);
}

export function StoreProvider({ children }) {
    async function uploadFile(file, downloadsLeft) {
        const uid = uuidv4() + "." + file.name.split(".").pop();

        storage.ref(uid).put(file);

        const { id } = await store.collection("files").add({
            uid: uid,
            fileName: file.name,
            downloadsLeft: downloadsLeft,
        });

        return id;
    }

    async function getFileURL(fileUid) {
        return await storage.ref(fileUid).getDownloadURL();
    }

    async function deleteFile(fileUid) {
        storage.ref(fileUid).delete();
    }

    function encFile(file) {
        console.log(file);
        var reader = new FileReader();
        let keyy = "";

        reader.onload = () => {
            let key = "password";

            let encrypted = AES.encrypt(reader.result, key);
            console.log(encrypted.key.toString());
            keyy = encrypted.key.toString();

            const encryptedFile = new File([encrypted.toString()], file.name, {
                type: file.type,
                lastModified: file.lastModified,
            });

            console.log(encryptedFile);
            decFile(encryptedFile, keyy);
            return encryptedFile;
        };

        reader.readAsBinaryString(file);
    }

    function decFile(file, keyy) {
        console.log(keyy);
        var reader = new FileReader();

        reader.onload = () => {
            let key = "password";

            let decrypted = AES.decrypt(reader.result, keyy);

            const decryptedFile = new File([decrypted.toString()], file.name, {
                type: file.type,
                lastModified: file.lastModified,
            });

            console.log(decryptedFile);
            return decryptedFile;
        };

        reader.readAsBinaryString(file);
    }

    const value = {
        uploadFile,
        getFileURL,
        deleteFile,
        encFile,
        decFile,
    };

    return (
        <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
    );
}
