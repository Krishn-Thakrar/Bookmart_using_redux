import React from "react";
import Logo from '../assets/logo.png'

function Footer(){
    return(
        <>
            <div style={{display: "flex", justifyContent: "center", marginTop: "10px"}}>
                <img src={Logo} alt="TatvaSoft_Logo" style={{height: "45px", width: "45px", marginTop: "13px"}} />
                <p>
                    TatvaSoft<br />
                    Sculpting Thoughts....
                </p>
            </div>
        </>
    )
}

export default Footer;