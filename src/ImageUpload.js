import React, { useState } from 'react'
import './ImageUpload.css';
import { Button } from '@material-ui/core'
import { storage, db } from './firebase'
import firebase from "firebase";

function ImageUpload({username}) {

    const [caption, setCaption] = useState('');
    const [image, setImage] = useState(null);    
    const [progress, setProgress] = useState(0);

        //pega o primeiro arquivo (e somente ele) selecionado pela janela de seleção de arquivos
    const handleChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };
    
    const handleUpload = () => {
        //acessa ao Storage do Firebase e pega uma referência para a imagem
        //image.name é nome da imagem ex.: photo01.jpg... e salva em images/

        const uploadTask = storage.ref(`images/${image.name}`).put(image);
                                        //use `  não '
                                    
        uploadTask.on(
            "state_changed",
            (snapshot) => { 
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) *100
                        //progresso do upload
                );
                setProgress(progress);
            },
                //em caso de erro (similar ao catch)
            (error) => {
                console.log(error);
                alert(error.message);
            },
                //função de upload (similar ao try)            
            () => {
                storage
                    .ref("images")      //referência da imagem em images/ (collection... entenda collections como "tabela" do .db)
                    .child(image.name)  //vai até o nome da imagem
                    .getDownloadURL()   //pega o endereço da URL de download
                    .then( url => {     //e então vai em posts e faz o seguinte:
                        db.collection("posts").add({    
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(), //1- adicione a data e hora do servidor no momento do upload no campo timestamp da postagem
                            caption: caption,                                           //2- adicione a legenda, caption, da postagem
                            imageUrl: url,                                              //3- agora pegue a URL de download que acabou de criar e guarde no campo imageUrl
                            username: username                                          //4- adicione o username que foi recebido na função ao compo username da postagem
                        });
                    setProgress(0);
                    setCaption("");
                    setImage(null);
                });
            }
        );
    };

    return (
        <div className="imageupload">

            <progress className="imageupload__progress" value={progress} max="100" />

            <input                
                type="text"
                placeholder='Adicione a legenda'
                onChange={event => setCaption (event.target.value)}
                value={caption}                 
            />

            <input type="file" onChange={handleChange}/>

            <Button color="primary" onClick={handleUpload}>
                Upload
            </Button>                

        </div>
    )
}

export default ImageUpload
