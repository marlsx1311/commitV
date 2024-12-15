import react from "react";
const Header = () =>{
    return (
        <header className="flex flex-col justify-center items-center">
            <img src="../public/logo.png" alt="logo commitV" className="w-72"/>
            <h1 className="text-4xl  text-center text-sky-300 mt-10 font-bold">MONITOREA TU ULTIMO COMMIT O EL DE TUS COLABORADORES EN GitHub</h1>
        </header>
    );
}
export default Header