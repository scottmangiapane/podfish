import './Spinner.css';

function Spinner() {
    return (
        <div className='center wrapper'>
            <div
                className={ 'spinner' }
                style={{ height: '48px', width: '48px' }}></div>
        </div>
    );
}

export default Spinner;
