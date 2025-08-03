import { useEffect, useRef } from 'react';

function AudioPlayer({ audioSource }) {
    const audioRef = useRef(null);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const handleEnded = () => {
            console.log('Audio has finished playing!');
            // Do something here (e.g., trigger next track, update UI)
        };

        audio.addEventListener('ended', handleEnded);

        return () => {
            audio.removeEventListener('ended', handleEnded);
        };
    }, [audioSource]);

    return (
        // Just using 'ref' to hook into the DOM audio element
        <audio src='audioSource' controls autoPlay ref={audioRef}>
        </audio>
    );
}
export default AudioPlayer;