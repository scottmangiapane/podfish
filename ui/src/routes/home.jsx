import reactLogo from '../assets/react.svg';
import viteLogo from '/vite.svg';

function Home() {
    return (
        <div className='center'>
            <h1>Home Page</h1>
            <div>
                <a href="https://vitejs.dev" target="_blank">
                <img src={viteLogo} className="logo" alt="Vite logo" />
                </a>
                <a href="https://react.dev" target="_blank">
                <img src={reactLogo} className="logo" alt="React logo" />
                </a>
            </div>
        </div>
    );
}

export default Home;
