var audio = window.parent.document.getElementById("myaudio");
var source = window.parent.document.getElementById("mysource");
var playlistdiv = window.parent.document.getElementById('playlistdiv');
function add_playlist(song_id){
    fetch("http://localhost:8006/playlist/addsong/" + song_id)
        .then(res => res.json())
        .then((data) => {
            var playlist_song_div = document.createElement("div");
            playlist_song_div.className="playlist_song_div";
            var playlist_song_button = document.createElement("div");
            playlist_song_button.className="playlist_song_button";
            var div2 = document.createElement("div");
            var img = document.createElement("img");
            div2.className="playlist_content";
            div2.id = data.num;
            div2.addEventListener('click', function(){
                clickPlaylist(this);
            });
            if(data.song_name.length > 10){
                data.song_name = data.song_name.substring(0,10) + " ...";
            }
            div2.innerText=data.song_name;
            playlist_song_div.appendChild(div2);
            div2 = document.createElement("div");
            div2.className="playlist_upper";
            div2.id = data.num;
            div2.addEventListener('click', function(){
                upper_Song_Playlist(this);
            });
            img.src="/img/upper.png";
            img.className="upperimg";
            div2.appendChild(img);
            playlist_song_button.appendChild(div2);
            div2 = document.createElement("div");
            div2.className="playlist_lower";
            div2.id = data.num;
            div2.addEventListener('click', function(){
                lower_Song_Playlist(this);
            });
            img = document.createElement("img");
            img.src="/img/lower.png";
            img.className="lowerimg";
            div2.appendChild(img);
            playlist_song_button.appendChild(div2);
            div2 = document.createElement("div");
            div2.className="playlist_delete";
            div2.id = data.num;
            div2.addEventListener('click', function(){
                delete_Song_Playlist(this);
            });
            div2.innerHTML="X"
            playlist_song_button.appendChild(div2);
            playlist_song_div.appendChild(playlist_song_button);
            playlistdiv.appendChild(playlist_song_div);
        })
        .catch(error => console.error(error));
}