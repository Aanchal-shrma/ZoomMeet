import React from 'react'
import "../App.css"
import { Link, useNavigate } from 'react-router-dom'

export default function LandingPage() {

    const router = useNavigate();

    return (
        <div className='landingPageContainer'>
            <nav className='landingNav'>
                <div className='navHeader'>
                    <h2>Apna Video Call</h2>
                </div>

                <div className='navlist'>
                    <p onClick={() => router("/aljk23")}>Join as Guest</p>
                    <p onClick={() => router("/auth")}>Register</p>

                    <div className='loginBtn' onClick={() => router("/auth")} role='button'>
                        <p>Login</p>
                    </div>
                </div>
            </nav>

            <div className="landingMainContainer">
                <div className="landingLeft">
                    <h5>
                        <span className="highlight">Connect</span> with your loved Ones
                    </h5>

                    <p className="second-heading">
                        Cover a distance by Apna Video Call
                    </p>

                    <div className="getStartedBtn" role='button'>
                        <Link to={"/auth"}>Get Started</Link>
                    </div>
                </div>

                <div className="landingRight">
                    <img className="landingImage" src="/mobile.png" alt="Video Call App" />
                </div>
            </div>
        </div>
    )
}
