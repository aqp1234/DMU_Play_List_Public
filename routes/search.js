const express = require('express');
const router = express.Router();
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

const Artist = require('../schemas/artist');
const Album = require('../schemas/album');
const Song = require('../schemas/song');

router.get('/', async(req, res, next)=> {

    const Album2=await Album.find().sort({release_date:1});
    
    var searchQuery=createSearchQuery(req.query); //검색을 위해 검색쿼리함수를 만들자
    const count =await Album.countDocuments(searchQuery).sort({release_date:1});//그리고 게시물 카운트 조건으로 넣었다

    var searchText = req.query.searchText;
    
    try{
        
        const posts=await Album.find(searchQuery) //여기에도 검색함수 넣었음
        .populate('artist_id')
        .sort('release_date')
        .exec();

        const album=await Album.find(searchQuery) //우선은 앨범기준
        .populate('artist_id')
        .sort('artist_id')       
        .exec(); 

        const song=await Song.find(searchQuery) //우선은 앨범기준으로 전체 불러오기 위한?
        .populate('artist_id')
        .sort('artist_id')
        .exec();

        const artist=await Artist.find(searchQuery) //우선은 앨범기준
        .populate('artist_id')
        .sort('artist_id')
        .exec();
        var ring=album.length;
        var hello =parseInt(req.query.ring);

        const artist_cont=await Artist.find({name:req.query.searchText})
        .sort('artist_id');

        const album_cont=await Album.find({album_name:req.query.searchText})
        .sort('artist_id');

        const song_cont=await Song.find({song_name:req.query.searchText})
        .sort('artist_id');

        var ring2=artist_cont.length;
        var ring3=album_cont.length;
        var ring4=song_cont.length;
        var ring5=artist.length;

        for(var k=0; k<posts.length; k++){
            var arti=0;
            if(artist_cont[k]!=null && album_cont[k]!=null){
                arti=5;
            }else if(album_cont[k]!=null){
                arti=2;
            }else if(song_cont[k]!=null){
                arti=3;
            }else if(artist_cont[k]!=null){
                arti=1;
            }
            
            if(parseInt(searchText.length)==0){
            
                res.render('search/search_main',{
                });
            }else if(arti==1){
                
                for(var i=0; i<ring2; i++){
                    if(searchText==artist_cont[i].name) console.log("teteteTet"+artist_cont[i].name);
                }
                res.render('search/search_artist',{
                    posts:posts,
                    Album2:Album2,
                    album:album,
                    artist:artist,
                    artist_cont:artist_cont,
                    song:song,
                    ring2:ring2,
                    hello:hello,
                    count:count,
                    searchType:req.query.searchType,//검색함수용 2줄
                    searchText:req.query.searchText
                });
            }else if(arti==2){
                
                
                for(var z=0; z<ring3; z++){
                    if(searchText==album_cont[z].album_name){
                        
                        const album_index=album_cont[z].artist_id._id;
                        console.log(album_cont[z].artist_id);    
                        console.log(album_cont[z].artist_id._id);
                        const artist_of_album=await Artist.find({_id:album_index});
                       
                        var kill=artist_of_album[z].name;
                        var str=kill;                        
                    }
                }
    
                res.render('search/search_album',{
                    posts:posts,
                    Album2:Album2,
                    album:album,
                    artist:artist,
                    album_cont:album_cont,
                    song:song,
                    ring3:ring3,
                    hello:hello,
                    kill:kill,
                    count:count,                  
                    searchType:req.query.searchType,//검색함수용 2줄
                    searchText:req.query.searchText,
                });
            }else if(arti==3){

                res.render('search/search_song',{
                    posts:posts,
                    Album2:Album2,
                    album:album,
                    artist:artist,
                    album_cont:album_cont,
                    song:song,
                    ring4:ring4,
                    hello:hello,
                    count:count,
                    searchType:req.query.searchType,//검색함수용 2줄
                    searchText:req.query.searchText
                });
            }else if(arti==5){

                res.render('search/search_multi',{
                    posts:posts,
                    Album2:Album2,
                    album:album,
                    artist:artist,
                    artist_cont:artist_cont,
                    album_cont:album_cont,
                    song:song,
                    ring:ring,
                    ring2:ring2,
                    ring3:ring3,
                    ring4:ring4,
                    ring5:ring5,
                    hello:hello,
                    count:count,
                    searchType:req.query.searchType,//검색함수용 2줄
                    searchText:req.query.searchText
                });
            }else{
                res.render('search/search_all',{
                    posts:posts,
                    Album2:Album2,
                    album:album,
                    artist:artist,
                    song:song,
                    ring:ring,
                    hello:hello,
                    count:count,
                    searchType:req.query.searchType,//검색함수용 2줄
                    searchText:req.query.searchText
                });
            }

        }


        
        
       
    
    }catch(err){
        console.error(err);
        next(err);
    }

    
    
   
});

function createSearchQuery(queries){
    var searchQuery={};
    if(queries.searchType && queries.searchText &&queries.searchText.length >= 1){
        
        var searchTypes = queries.searchType.toLowerCase().split(',');
        var postQuries = [];
        if(searchTypes.indexOf('album_album_name')==0){
            postQuries.push({album_name: {$regex:new RegExp(queries.searchText, 'i')}});
        }
        if(searchTypes.indexOf('artist_name')==0){
            postQuries.push({artist_name : {$regex: new RegExp(queries.searchText,'i')}});
        }
        if(postQuries.length>0)searchQuery={$or:postQuries};
        
    }
    return searchQuery;
    
}


module.exports = router;