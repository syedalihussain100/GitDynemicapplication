const baseUrl = `https://api.github.com/users`;
// error display message start
const getalertMessage = (status) => {
    const MessageDiv = document.querySelector("#message");
    let errorMessage = ``;
    if (status === 404) {
        errorMessage = `<div class="alert alert-danger text-center font-weight-bold">Profile Doesn't Exit!</div>`
    }
    MessageDiv.innerHTML = errorMessage;

    setTimeout(() => {
        MessageDiv.innerHTML = errorMessage = "";
    }, 1500);

}
//error display message end

//github api calling here
const getGithubUrl = async (login) => {
    try {
        const response = await fetch(`${baseUrl}/${login}`);
        if (response.status !== 200) {
            if (response.status === 404) {
                getalertMessage(response.status)
            }
            new Error(`Something Went Wrong! Status Code ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
    }
}
// github api calling end

// get repos start
const getRepos = async (login) => {
    try {
        const response = await fetch(`${baseUrl}/${login}/repos`);
        if (response.status !== 200) {
            new Error(`Something Went Wrong! Status Code ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
    }
}

// get repos end

// render github profile start
const renderProfile = (data) => {
    let getprofileSnipeet = ``;
    getprofileSnipeet += `
 <div class="profile-userpic">
 <img src="${data.avatar_url}" class="d-block">
</div>
<div class="profile-usertitle">`
    if (data.name !== null) {
        getprofileSnipeet += `  <div class="profile-usertitle-name">
        ${data.name}
    </div>`
    }

    getprofileSnipeet += `<div class="profile-usertitle-job">
   ${data.login}
 </div>
</div>
<div class="portlet light bordered">
 <!-- STAT -->
 <div class="row list-separated profile-stat">
     <div class="col-md-6 col-sm-6 col-xs-6">
         <div class="uppercase profile-stat-title">${data.followers}</div>
         <div class="uppercase profile-stat-text"> Followers </div>
     </div>
     <div class="col-md-6 col-sm-6 col-xs-6">
         <div class="uppercase profile-stat-title">${data.following}</div>
         <div class="uppercase profile-stat-text"> Following </div>
     </div>
 </div>`;
    if (data.bio !== null) {
        getprofileSnipeet += `<div><h4 class="profile-desc-title">About ${data.name}</h4>
     <span class="profile-desc-text">${data.bio}</span></div>`
    }
    if (data.twitter_username !== null) {

        getprofileSnipeet += `<div class="margin-top-20 profile-desc-link">
     <i class="fab fa-twitter"></i>
     <a target="_blank" href="https://www.twitter.com/${data.twitter_username}">@${data.twitter_username}</a>
 </div>`
    }

    getprofileSnipeet += `</div>`
    document.querySelector("#profile").innerHTML = getprofileSnipeet;
}


// list git repo start
const renderGitRepos = (repos) => {
    let ListRepos = ``;
    if (repos.length > 0) {
        repos.forEach(repo => {
            ListRepos += `
   <li class="mb-3 d-flex flex-content-stretch col-12 col-md-6 col-lg-6">
   <div class="card" style="width: 22.5rem;">
       <div class="card-body">
           <h5 class="card-title"><a target="_blank"
                   href="${repo.html_url}">${repo.name}</a>
           </h5>

           <p class="card-text">${repo.description !== null ? repo.description : "" }</p>
           
           <p>`;

            if (repo.language !== null) {
                ListRepos += `  <i class="fas fa-circle ${repo.language ? repo.language.toLowerCase() : ''}"></i> ${repo.language}`;
            }

            ListRepos += `  <i
                   class="far fa-star"></i> ${repo.stargazers_count}
                   
                   
                   </p>
       </div>
   </div>
</li>
   `
        })
    }
    document.querySelector("#repos").innerHTML = ListRepos
}


// list git repo end

// render github profile end
//  Parent function body start
document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.querySelector("#searchForm");
    searchForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const searchInput = document.querySelector("#searchInput");
        const getGithub = searchInput.value.trim();
        if (getGithub.length > 0) {
            const userProfile = await getGithubUrl(getGithub);
            console.log(userProfile);
            if (userProfile.login) {
                const GitRepos = await getRepos(getGithub);
                renderGitRepos(GitRepos);
                renderProfile(userProfile)
                document.querySelector(".searchblock").style.display = "none";
                document.querySelector(".profile").style.display = "block";
            }
        }
    })
})
// Parent function body end