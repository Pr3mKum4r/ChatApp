import heroImg from '../assets/heroImg.png';

const DefaultChatBox = () => {
    return(
        <div className="p-10 flex flex-col items-center">
            <img src={heroImg} alt='hero' className=''/>
            <p className='text-white text-xl text-center'>Welcome to the impressive ChatApp!!!</p>
        </div>
    )
}

export default DefaultChatBox;