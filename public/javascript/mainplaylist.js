var audio = window.parent.document.getElementById("myaudio");
var source = window.parent.document.getElementById("mysource");
var playlistnum = window.parent.document.getElementsByClassName("playlist_song_div");
function playAudio(){
    audio.autoplay=true;
    audio.play();
}
function pauseAudio(){
    audio.autoplay=false;
    audio.pause();
}
audio.addEventListener("ended", function(){
    nextAudio();
});
function clickPlaylist(e){
    fetch("http://localhost:8006/playlist/getAudio?num="+e.id)
        .then(res => res.json())
        .then(data => {
            audio.src=data.src;
            source.value = data.num;
            window.parent.document.getElementById("nowaudio").textContent = data.song_name;
        })
        .catch(err => console.error(err));
};
function nextAudio(){
    fetch("http://localhost:8006/playlist/nextAudio?num="+source.value)
        .then(res => res.json())
        .then(data => {
            audio.src = data.src;
            source.value = data.num;
        })
        .catch(error => console.log(error));
};
function upper_Song_Playlist(e){
    if(parseInt(e.id) == 0){
        return;
    }
    fetch("http://localhost:8006/playlist/upper?num="+e.id)
        .then(()=>{
            var num = parseInt(e.id);
            const playlistdiv = window.parent.document.getElementById("playlistdiv");
            const playlist_song_divs = window.parent.document.getElementsByClassName("playlist_song_div");
            playlistdiv.insertBefore(playlist_song_divs[num], playlist_song_divs[num-1]);
            playlist_song_divs[num].getElementsByClassName("playlist_content")[0].id=num;
            playlist_song_divs[num].getElementsByClassName("playlist_upper")[0].id=num;
            playlist_song_divs[num].getElementsByClassName("playlist_lower")[0].id=num;
            playlist_song_divs[num].getElementsByClassName("playlist_delete")[0].id=num;
            playlist_song_divs[num-1].getElementsByClassName("playlist_content")[0].id=num-1;
            playlist_song_divs[num-1].getElementsByClassName("playlist_upper")[0].id=num-1;
            playlist_song_divs[num-1].getElementsByClassName("playlist_lower")[0].id=num-1;
            playlist_song_divs[num-1].getElementsByClassName("playlist_delete")[0].id=num-1;
        })
        .catch(error => console.log(error));
};
function lower_Song_Playlist(e){
    if(parseInt(e.id) == window.parent.document.getElementsByClassName("playlist_song_div").length - 1){
        return;
    }
    fetch("http://localhost:8006/playlist/lower?num="+e.id)
        .then(()=>{
            var num = parseInt(e.id);
            const playlistdiv = window.parent.document.getElementById("playlistdiv");
            const playlist_song_divs = window.parent.document.getElementsByClassName("playlist_song_div");
            playlistdiv.insertBefore(playlist_song_divs[num+1], playlist_song_divs[num]);
            playlist_song_divs[num].getElementsByClassName("playlist_content")[0].id=num;
            playlist_song_divs[num].getElementsByClassName("playlist_upper")[0].id=num;
            playlist_song_divs[num].getElementsByClassName("playlist_lower")[0].id=num;
            playlist_song_divs[num].getElementsByClassName("playlist_delete")[0].id=num;
            playlist_song_divs[num+1].getElementsByClassName("playlist_content")[0].id=num+1;
            playlist_song_divs[num+1].getElementsByClassName("playlist_upper")[0].id=num+1;
            playlist_song_divs[num+1].getElementsByClassName("playlist_lower")[0].id=num+1;
            playlist_song_divs[num+1].getElementsByClassName("playlist_delete")[0].id=num+1;
        })
        .catch(error => console.log(error));
};
function delete_Song_Playlist(e){
    fetch("http://localhost:8006/playlist/delete?num="+e.id)
        .then(() => {
            var num = parseInt(e.id);
            const playlist_song_divs = window.parent.document.getElementsByClassName("playlist_song_div");
            playlist_song_divs[num].remove();
            for(i=num; i<playlist_song_divs.length; i++){
                playlist_song_divs[i].getElementsByClassName("playlist_content")[0].id=i;
                playlist_song_divs[i].getElementsByClassName("playlist_upper")[0].id=i;
                playlist_song_divs[i].getElementsByClassName("playlist_lower")[0].id=i;
                playlist_song_divs[i].getElementsByClassName("playlist_delete")[0].id=i;
            }
        })
        .catch(error => console.log(error));
};