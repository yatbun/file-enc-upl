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
        // newfile = await uploadToPythonBackend(file);



        const uid = uuidv4() + "." + newfile.name.split(".").pop();
        storage.ref(uid).put(newfile);

        const { id } = await store.collection("files").add({
            uid: uid,
            fileName: newfile.name,
            downloadsLeft: downloadsLeft,
        });

        return id;
    }

    const DEC = {
  signature: "RW5jcnlwdGVkIFVzaW5nIEhhdC5zaA", //add a line in the file that says "encrypted by Hat.sh :)"
  hash: "SHA-512",
  algoName1: "PBKDF2",
  algoName2: "AES-GCM",
  algoLength: 256,
  itr: 80000,
  salt: window.crypto.getRandomValues(new Uint8Array(16)),
  perms1: ["deriveKey"],
  perms2: ['encrypt', 'decrypt'],
}
function generateKey(password) { 
    const usedChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&_-+=~';
    let keyArray = new Uint8Array(20); //length of the key
    window.crypto.getRandomValues(keyArray); //randomize
    keyArray = keyArray.map(x => usedChars.charCodeAt(x % usedChars.length));
    const randomizedKey = String.fromCharCode.apply(null, keyArray);
    password.value = randomizedKey; //output the new key to the key input
    // keyCheckMeter(); //run the key strength checker
  }
  function importSecretKey(password
    ) { 
    let rawPassword = str2ab(password.value); // convert the password entered in the input to an array buffer
    return window.crypto.subtle.importKey(
      "raw", //raw
      rawPassword, // array buffer password
      {
        name: DEC.algoName1
      }, //the algorithm you are using
      false, //whether the derived key is extractable 
      DEC.perms1 //limited to the option deriveKey
    );
  
  }
  async function encryptFile(inputFile,password) {
    //check if file and password inputs are entered
    if (!inputFile.value || !password.value) {
    //   errorMsg("Please browse a file and enter a Key")
    } else {
      
      const derivedKey = await deriveEncryptionSecretKey(); //requiring the key
      const file = inputFile.files[0]; //file input
      const fr = new FileReader(); //request a file read
  
      const n = new Promise((resolve, reject) => {
  
    
        fr.onload = async () => { //load
  
          const iv = window.crypto.getRandomValues(new Uint8Array(16)); //generate a random iv
          const content = new Uint8Array(fr.result); //encoded file content
          // encrypt the file
          await window.crypto.subtle.encrypt({
              iv,
              name: DEC.algoName2
            }, derivedKey, content) 
            .then(function (encrypted) {
              //returns an ArrayBuffer containing the encrypted data
              resolve(processFinished('Encrypted-' + file.name, [window.atob(DEC.signature), iv, DEC.salt, new Uint8Array(encrypted)], 1, password.value)); //create the new file buy adding signature and iv and content
              //console.log("file has been successuflly encrypted");
              resetInputs(); // reset file and key inputs when done
            })
            .catch(function (err) {
              errorMsg("An error occured while Encrypting the file, try again!"); //reject
            });
          $(".loader").css("display", "none"); //hide spinner
        }
        //read the file as buffer
        fr.readAsArrayBuffer(file)
  
      });
    }
  }
  async function deriveEncryptionSecretKey() { //derive the secret key from a master key.

    let getSecretKey = await importSecretKey();
  
    return window.crypto.subtle.deriveKey({
        name: DEC.algoName1,
        salt: DEC.salt,
        iterations: DEC.itr,
        hash: {
          name: DEC.hash
        },
      },
      getSecretKey, //your key from importKey
      { //the key type you want to create based on the derived bits
        name: DEC.algoName2,
        length: DEC.algoLength,
      },
      false, //whether the derived key is extractable 
      DEC.perms2 //limited to the options encrypt and decrypt
    )
    //console.log the key
    // .then(function(key){
    //     //returns the derived key
    //     console.log(key);
    // })
    // .catch(function(err){
    //     console.error(err);
    // });
  
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
