function Keypad ({
    value,
    setValue,
    handleInputChange
}) {
    const digits = [];
    
    for(let i=9; i>0; i=i-3) {
        let digitRow = [];
        for(let j=(i-3+1); j<=i; j++) {
            digitRow.push(
                <div 
                className='digit button' 
                key={j} 
                onClick={() => {
                    handleInputChange(value + j.toString());
                }}
                >
                    {j}
                </div>
            );
        }
        digits.push(
            <div className="digit-row">
                {digitRow}
            </div>
        );
    }

    return (
        <div className="keypad">
            <div className="operands">
                <div className="digits">
                    {digits}
                </div>
                <div className="bottom-row">
                    <div></div>
                    <div className="zero button"
                    onClick={() => {
                        handleInputChange(value + '0');
                    }}
                    >
                        0
                    </div>
                    <div className="decimal button"
                    onClick={() => {
                        handleInputChange(value + '.');
                    }}
                    >
                        .
                    </div>
                </div>
            </div>
            <div className="operators">
                <div className="operators-col-1">
                    <div className="operator plus button"
                    onClick={() => {
                        handleInputChange(value + '+');
                    }}
                    >
                        &#43;
                    </div>
                    <div className="operator minus button"
                    onClick={() => {
                        handleInputChange(value + '-');
                    }}
                    >
                        &minus;
                    </div>
                    <div className="operator prod button"
                    onClick={() => {
                        handleInputChange(value + '*');
                    }}
                    >
                        &times;
                    </div>
                    <div className="operator div button"
                    onClick={() => {
                        handleInputChange(value + '/');
                    }}
                    >
                        &divide;
                    </div>
                </div>
                <div className="operators-col-2">
                    <div className="operator percentage button"
                    onClick={() => {
                        handleInputChange(value + '%');
                    }}
                    >
                        &#37;
                    </div>
                    <div className="operator clear-screen button" onClick={() => {
                        setValue('');
                    }}>
                        AC
                    </div>
                    <div className="operator-equals button"
                    onClick={() => {
                        handleInputChange(value + '=');
                    }}
                    >
                        &#61;
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Keypad;