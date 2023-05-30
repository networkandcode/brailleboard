const TextBox = () => {
    return (
        <div style={{ justifyContent: `center`, height: `100vh`, width: `100%` }} >
            <h2> New document: </h2>
            { brailleMode 
                ? (
                    <textarea
                        id='brailleText'
                        name='brailleText'
                        onKeyDown={handleKeyDown}
                        placeholder='View in Braille'
                        ref={brailleTextRef}
                        style={{ fontSize: `50px`, height: `100%`, lineHeight: `1`, overflow: `hidden`, width: `100%` }}
                        value={brailleText}
                    />
                ) : ( 
                    <textarea
                        id='text'
                        onChange={onChange}
                        onKeyDown={handleKeyDown}
                        name='text'
                        placeholder='Type in English'
                        ref={textRef}
                        style={{ fontSize: `50px`, height: `100%`, lineHeight: `1`, overflow: `hidden`, width: `100%` }}
                        value={text}
                    />
                )
            }
        </div>
    )
}

export default TextBox