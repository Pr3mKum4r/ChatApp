import heroImg from '../assets/heroImg.png';

const DefaultChatBox = () => {
    return(
        <div className="p-10 flex flex-col items-center">
            <img src={heroImg} alt='hero' className=''/>
            <p className='text-white text-lg text-center px-10 font-poppins'>Welcome to TerraChat a revolutionary chat app designed to seamlessly translate conversations in real-time, enabling users from different linguistic backgrounds to connect and communicate effortlessly.</p>
        </div>
    )
}

export default DefaultChatBox;