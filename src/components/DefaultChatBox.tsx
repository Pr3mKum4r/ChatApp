import heroImg from '../assets/heroImg.png';

const DefaultChatBox = () => {
    return(
        <div className="p-10 lg:ml-5">
            <img src={heroImg} alt='hero'/>
            <p className='text-white text-xl text-center'>Welcome to the impressive ChatApp!!!</p>
        </div>
    )
}

export default DefaultChatBox;