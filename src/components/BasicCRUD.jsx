import {useState} from "react";
import axios from "axios";

function CreateDoc(props) {
    const [name,setName] = useState('');
    const [collection,setCollection] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const createDoc = async () => {
        setLoading(true);
        setError(null);
        try {
            const newDoc = (await axios.get(`http://localhost:4410/CreateDoc?apiKey=${props.apiKey}&name=${name}&collection=${collection}`)).data;
            props.onCreation(collection,newDoc);
        } catch (error) {
            setError('Failed to create document: ' + error.message);
        } finally {
            setLoading(false);
        }
    };
    return (<div>
        <input placeholder="Input document name" onChange={(e) => setName(e.target.value)} />
        <input placeholder="Input collection name" onChange={(e) => setCollection(e.target.value)} />
        {loading && <h3>Loading...</h3>}
        {error && (<h3>Error has occurred! {error}</h3>)}
        <button onClick={createDoc}>Create Document</button>
    </div>)
}
function ShowDocs(props){
    const[loading,setLoading] = useState(false)
    const[error,setError] = useState("");
    const readDocs = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`http://localhost:4410/GetDocs?apiKey=${props.apiKey}&collection=${props.collection}`)
            if (!response.data){
                setError("Document is null")
            }
            props.setDocs(response.data)
        } catch (error) {
            setError('Failed to load documents: ' + error.message);
        } finally {
            setLoading(false);
        }
    };
    const updateDocInList = (updatedDoc) => {
        props.setDocs(prev=>prev.map(doc => doc.Id===updatedDoc.Id? updatedDoc : doc));
    }
    const onDelete = (deletedId) =>{
        props.setDocs(prev=>prev.filter(doc => doc.Id!==deletedId));
    }
    return <div>
        <input placeholder="Input collection" onChange={(e) => props.setCollection(e.target.value)} />
        <button onClick={readDocs}>View Documents</button>
        {loading && <h3>Loading...</h3>}
        {error && <h3>Error has occurred! {error}</h3>}
        {props.docs && props.docs.map((doc,index) => {
            return <ProcessDoc
                collection={props.collection}
                apiKey={props.apiKey}
                key={index}
                doc={doc}
                onDocUpdate={updateDocInList}
                onDelete={onDelete}
            />
        })}

    </div>
}
function ProcessDoc(props) {
    const entries = Object.entries(props.doc.Values || {});
    return (<div>
        <h4>{props.doc.Name}</h4>
        {entries.length > 0 ?
            (entries.map(([key, value], i) => (
                <div key={i}>
                    <strong>{key}:</strong> {String(value)}
                </div>
            )))
            : (<i>No values in document</i>)
        }
        <AddValueToDoc
            id={props.doc.Id}
            collection={props.collection}
            apiKey={props.apiKey}
            onDocUpdate={props.onDocUpdate}
        />
        <RemoveValueFromDoc
            id={props.doc.Id}
            collection={props.collection}
            apiKey={props.apiKey}
            onDocUpdate={props.onDocUpdate}
        />
        <DeleteDocument
            id={props.doc.Id}
            collection={props.collection}
            apiKey={props.apiKey}
            onDelete={props.onDelete}
        />
    </div>)
}

function AddValueToDoc(props){
    const [name,setName] = useState('');
    const [value,setValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const submitValue = async () => {
        setLoading(true);
        setError(null);
        try {
            await axios.get(`http://localhost:4410/AddValueToDoc?apiKey=${props.apiKey}&id=${props.id}&collection=${props.collection}&valueName=${name}&value=${value}`);
            const updatedDocRes = await axios.get(`http://localhost:4410/GetDocByID?apiKey=${props.apiKey}&id=${props.id}&collection=${props.collection}`);
            props.onDocUpdate(updatedDocRes.data);
        } catch (error) {
            setError('Failed to update document: ' + error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <input placeholder="Enter value name" onChange={(e) => setName(e.target.value)} />
            <input placeholder="Enter value" onChange={(e) => setValue(e.target.value)} />
            <button onClick={submitValue}>Add Value</button>
            {loading && <h4>Loading...</h4>}
            {error && <h4>Error has occurred! {error}</h4>}
        </div>
    )
}
function RemoveValueFromDoc(props){
    const [name,setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const submitValue = async () => {
        setLoading(true);
        setError(null);
        try {
            await axios.get(`http://localhost:4410/RemoveValueFromDoc?apiKey=${props.apiKey}&id=${props.id}&collection=${props.collection}&valueName=${name}`);
            const updatedDocRes = await axios.get(`http://localhost:4410/GetDocByID?apiKey=${props.apiKey}&id=${props.id}&collection=${props.collection}`);
            props.onDocUpdate(updatedDocRes.data);
        } catch (error) {
            setError('Failed to update document: ' + error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <input placeholder="Enter value name" onChange={(e) => setName(e.target.value)} />
            <button onClick={submitValue}>Remove Value</button>
            {loading && <h4>Loading...</h4>}
            {error && <h4>Error has occurred! {error}</h4>}
        </div>
    )
}
function DeleteDocument(props){
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const deleteDocument = async () => {
        setLoading(true);
        try {
            await axios.get(`http://localhost:4410/DeleteDocByID?id=${props.id}&collection=${props.collection}&apiKey=${props.apiKey}`)
            props.onDelete(props.id)
        }
        catch(error) {
            setError('Failed to delete document: ' + error.message);
        }
        finally {
            setLoading(false)
        }
    }
    return (
        <div>
            <button onClick={deleteDocument}>Delete Document</button>
            {loading && <h4>Loading...</h4>}
            {error && <h4>Error has occurred! {error}</h4>}
        </div>
    )
}

export {CreateDoc, ShowDocs};