import {Link, useLocation} from 'react-router-dom';
import {CreateDoc, ShowDocs} from "./BasicCRUD.jsx";
import {useState} from "react";

function UserHome() {
    const location = useLocation();
    const { apiKey } = location.state || {};
    const [collection, setCollection] = useState('');
    const [docs, setDocs] = useState([]);
    const onCreation = (collectionOfDoc,doc) => {
        if (collectionOfDoc === collection) {
            var exists = false
            docs.forEach((docI) => {
                if (docI.Name === doc.Name){
                    exists = true;
                }
            })
            if (!exists){
                setDocs(prevState => [...prevState,doc]);
            }
        }
    }

    return (
        <div>
            <h1>
                Welcome!
            </h1>
            <Link to={'/'}>
                Log Out
            </Link>
            <h2>
                Your APIKey is {apiKey}
            </h2>
            <CreateDoc
                apiKey={apiKey}
                onCreation={onCreation}
            />
            <ShowDocs
                apiKey={apiKey}
                setDocs={setDocs}
                docs={docs}
                collection={collection}
                setCollection={setCollection}
            />
        </div>
    );
}

export default UserHome;