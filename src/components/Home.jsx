import axios from "axios";
import {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
function Home(){
    const [key, setKey] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const generateKey = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get("http://localhost:4410/GenerateAPIKey");
            setKey(response.data);
            navigate('/UserHome', { state: { apiKey: response.data } });
        } catch (error) {
            setError('Failed to generate key: ' + error.message);
        } finally {
            setLoading(false);
        }
    };
    return (
        <div>
            <h1>Welcome!</h1>
            <button onClick={generateKey}>Generate API key</button>
            <br/>
            <input onChange={(e) => setKey(e.target.value)} type="text" placeholder="Enter API key for login"/>
            <Link to={'/UserHome'} state={{apiKey: key}}>
                Log in with APIKey:
            </Link>
            {loading && <h3>Loading...</h3>}
            {(error != null) && (<h3>Error has occurred! {error}</h3>)}
        </div>
    )
}

export default Home;