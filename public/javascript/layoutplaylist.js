var audio = document.getElementById("myaudio");
var source = document.getElementById("mysource");
var playlistnum = document.getElementsByClassName("playlist_song_div");
var timerange = document.getElementById("timerange");
var progress_val = 0;
setInterval(() => {
    currentTime = Math.floor(audio.currentTime);
    maxTime = audio.duration;
    document.getElementById("currentTime").innerHTML = setTimeFormat(currentTime);
    progress_val = (currentTime/maxTime)*100;
    progress_val = progress_val.toFixed(1);
    timerange.value = progress_val;
}, 100);
audio.volume=0.2;
audio.onloadedmetadata = function(){
    currentTime = Math.floor(audio.currentTime);
    maxTime = audio.duration;
    progress_val = (currentTime/maxTime)*100;
    progress_val = progress_val.toFixed(1);
    timerange.value = progress_val;
    document.getElementById("maxTime").innerHTML = setTimeFormat(maxTime);
}
fetch("http://localhost:8006/playlist/getAudio?num="+0)
        .then(res => res.json())
        .then(data => {
            audio.src=data.src;
            source.value = data.num;
        })
        .catch(err => console.error(err));
function playAudio(){
    audio.autoplay=true;
    audio.play();
}
function pauseAudio(){
    audio.autoplay=false;
    audio.pause();
}
function setVolume(){
    audio.volume=document.getElementById("volume").value/100;
}
function setTime(){
    audio.currentTime = Math.floor(timerange.value/100*audio.duration);
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
            document.getElementById("nowaudio").textContent = data.song_name;
        })
        .catch(err => console.error(err));
};
function nextAudio(){
    fetch("http://localhost:8006/playlist/nextAudio?num="+source.value)
        .then(res => res.json())
        .then(data => {
            audio.src = data.src;
            source.value = data.num;
            document.getElementById("nowaudio").textContent = data.song_name;
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
            const playlistdiv = document.getElementById("playlistdiv");
            const playlist_song_divs = document.getElementsByClassName("playlist_song_div");
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
    if(parseInt(e.id) == document.getElementsByClassName("playlist_song_div").length - 1){
        return;
    }
    fetch("http://localhost:8006/playlist/lower?num="+e.id)
        .then(()=>{
            var num = parseInt(e.id);
            const playlistdiv = document.getElementById("playlistdiv");
            const playlist_song_divs = document.getElementsByClassName("playlist_song_div");
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
            const playlist_song_divs = document.getElementsByClassName("playlist_song_div");
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
function setTimeFormat(sec_time){
    var sec_num = parseInt(sec_time);
    var minutes = Math.floor(sec_num / 60);
    var seconds = sec_num - (minutes * 60);

    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}

    return minutes + ':' + seconds;
}