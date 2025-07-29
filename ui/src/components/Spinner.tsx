import './Spinner.css';

interface TSpinnerProps {
    borderSize?: string;
    margin?: string;
    size?: string;
}

function Spinner({ borderSize, margin, size }: TSpinnerProps) {
    return (
        <div className='center wrapper'>
            <div
                className={ 'spinner' }
                style={{
                    borderTopWidth: borderSize,
                    borderWidth: borderSize,
                    margin,
                    height: size,
                    width: size,
                }}></div>
        </div>
    );
}

export default Spinner;
