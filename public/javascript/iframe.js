//iframe 만 새로고침 하는 script (iframe으로 보여주는 페이지에만 적용)
document.onkeydown = trapRefresh;
    function trapRefresh(e) {
        if(e.keyCode == 116){
            e.keyCode = 0;
            e.cancelBubble = true;
            e.returnValue = false;
            this.location.reload();
        }
    }
var playlist_content = window.parent.document.getElementsByClassName("playlist_content");
var playlist_upper = window.parent.document.getElementsByClassName("playlist_upper");
var playlist_lower = window.parent.document.getElementsByClassName("playlist_lower");
var playlist_delete = window.parent.document.getElementsByClassName("playlist_delete");
for(i=0;i<playlist_content.length; i++){
    playlist_content[i].onclick = function(){
        clickPlaylist(this);
    }
    playlist_upper[i].onclick = function(){
        upper_Song_Playlist(this);
    }
    playlist_lower[i].onclick = function(){
        lower_Song_Playlist(this);
    }
    playlist_delete[i].onclick = function(){
        delete_Song_Playlist(this);
    }
}