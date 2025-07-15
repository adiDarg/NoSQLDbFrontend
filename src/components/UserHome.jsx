import { useLocation } from 'react-router-dom';
import {CreateDoc, ShowDocs} from "./BasicCRUD.jsx";

function UserHome() {
    const location = useLocation();
    const { apiKey } = location.state || {};

    return (
        <div>
            <h1>
                Welcome!
            </h1>
            <h2>
                Your APIKey is {apiKey}
            </h2>
            <CreateDoc apiKey={apiKey}/>
            <ShowDocs apiKey={apiKey}/>
        </div>
    );
}

export default UserHome;