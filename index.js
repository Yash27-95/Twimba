import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

import { tweetsData } from './data.js';

document.addEventListener('click', function(e){
    if(e.target.dataset.like){
       handleLikeClick(e.target.dataset.like) 
    }
    else if(e.target.dataset.retweet){
        handleRetweetClick(e.target.dataset.retweet)
    }
    else if(e.target.dataset.reply){
        handleReplyClick(e.target.dataset.reply)
    }
    else if(e.target.id === 'tweet-btn'){
        handleTweetBtnClick()
    }
    else if(e.target.dataset.btn){
        handleCommentClick(e.target.dataset.btn)
    }
    else if(e.target.dataset.deleteBtn){
        handleDeleteTweet(e.target.dataset.deleteBtn)
    }
})
 
function handleLikeClick(tweetId){ 
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]

    if (targetTweetObj.isLiked){
        targetTweetObj.likes--
    }
    else{
        targetTweetObj.likes++ 
    }
    targetTweetObj.isLiked = !targetTweetObj.isLiked
    render()
}

function handleRetweetClick(tweetId){
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    
    if(targetTweetObj.isRetweeted){
        targetTweetObj.retweets--
    }
    else{
        targetTweetObj.retweets++
    }
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted
    render() 
}

function handleReplyClick(replyId){
    document.getElementById(`replies-${replyId}`).classList.toggle('hidden')
}

function handleTweetBtnClick(){
    const tweetInput = document.getElementById('tweet-input')

    if(tweetInput.value){
        tweetsData.unshift({
            handle: `@Scrimba`,
            profilePic: `images/scrimbalogo.png`,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4()
        })
    render()
    tweetInput.value = ''
    }

}

function handleCommentClick(tweetId){
    let commentInput = document.getElementById(`input-${tweetId}`).value
    tweetsData.filter(function(tweet){
        if(tweet.uuid === tweetId && commentInput){
            tweet.replies.unshift({
                handle: `@Scrimba`,
                profilePic: `images/scrimbalogo.png`,
                tweetText: commentInput,
            },)
            return true
        }
    })
    render()
    handleReplyClick(tweetId)
    commentInput = "" 
}

function handleDeleteTweet(tweetId){
    const tweetsDataRemain = tweetsData.filter(function(tweet){
        return tweet.uuid !== tweetId
    })
    console.log(tweetsDataRemain)
    render()
}

function getFeedHtml(){

    let feedHtml = ``

    tweetsData.forEach(function(tweet){
    
        let likeIconClass = ''
        
        if (tweet.isLiked){
            likeIconClass = 'liked'
        }
        
        let retweetIconClass = ''
        
        if (tweet.isRetweeted){
            retweetIconClass = 'retweeted'
        }
        
        let repliesHtml = ''
        
        if(tweet.replies.length > 0){
            tweet.replies.forEach(function(reply){
                repliesHtml+=`
                <div class="tweet-reply">
                    <div class="tweet-inner">
                        <img src="${reply.profilePic}" class="profile-pic">
                            <div>
                                <p class="handle">${reply.handle}</p>
                                <p class="tweet-text">${reply.tweetText}</p>
                            </div>
                        </div>
                </div>
                `
            })
        }else{
            repliesHtml += `
            <div class="tweet-reply">
                <p class="no-comment">No replies</p>
            </div>
            `
        }
          
        feedHtml += `
<div class="tweet">
    <div class="tweet-inner">
        <img src="${tweet.profilePic}" class="profile-pic">
        <i class="${tweet.handle === '@Scrimba' ? 'show-deleteBtn' : 'hide-deleteBtn'} fa-solid fa-trash"
        data-delete-btn="${tweet.uuid}"
        ></i>
        <div>
            <p class="handle">${tweet.handle}</p>
            <p class="tweet-text">${tweet.tweetText}</p>
            <div class="tweet-details">
                <span class="tweet-detail">
                    <i class="fa-regular fa-comment-dots"
                    data-reply="${tweet.uuid}"
                    ></i>
                    ${tweet.replies.length}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-heart ${likeIconClass}"
                    data-like="${tweet.uuid}"
                    ></i>
                    ${tweet.likes}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-retweet ${retweetIconClass}"
                    data-retweet="${tweet.uuid}"
                    ></i>
                    ${tweet.retweets}
                </span>
            </div>   
        </div>            
    </div>
    <div class="hidden" id="replies-${tweet.uuid}">
        <div class="add-comment" id="comment-${tweet.uuid}">
            <img src="images/scrimbalogo.png" class="profile-pic-comment">
            <input type="text" placeholder="Reply to ${tweet.handle}" id="input-${tweet.uuid}">
            </input>
            <button class="comment-btn" data-btn="${tweet.uuid}">Post</buttn>
        </div>
        ${repliesHtml}
    </div>   
</div>
`
   })
   return feedHtml 
}

function render(){
    document.getElementById('feed').innerHTML = getFeedHtml()
}

render()

