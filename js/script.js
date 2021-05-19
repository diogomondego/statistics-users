let searchInput = null
let searchBtn = null

let countUsers = 0
let tabUsers = null

let allUsers = []

let statistics = null
let tabStatistics = null

let numberFormat = null

window.addEventListener('load', () => {
    searchInput = document.querySelector('#searchInput')
    searchBtn = document.querySelector('#searchBtn')

    countUsers = document.querySelector('#countUsers')
    tabUsers = document.querySelector('#tabUsers')

    statistics = document.querySelector('#statistics')
    tabStatistics = document.querySelector('#tabStatistics')

    numberFormat = Intl.NumberFormat('pt-BR')

    fetchUsers()
})

// function fetchUsers() {
//     fetch('https://randomuser.me/api/?seed=javascript&results=100&nat=BR&noinfo').then(res => {
//         res.json().then(json => {
//             allUsers = json
//             console.log(allUsers)
//         })
//     })
// }

async function fetchUsers() {
    const res = await fetch('https://randomuser.me/api/?seed=javascript&results=100&nat=BR&noinfo')
    const json = await res.json()
    allUsers = json.results.map(user => {
        const { dob, name, gender, picture } = user
        return {
            age: dob.age,
            name: name.first + ' ' + name.last,
            gender,
            picture: picture.thumbnail
        }
    })

    searchUser()
    submitSearch()
}

function searchUser() {
    searchInput.addEventListener('keyup', () => {
        searchBtn.disabled = false

        if (searchInput.value.trim() === '') {
            searchBtn.disabled = true
        } else if (event.key === 'Enter') {
            searchInput.value = event.target.value.trim()
            renderUserList(event.target.value.trim())
        }
    })
}

function submitSearch() {
    searchBtn.addEventListener('click', () => {
        searchInput.value = searchInput.value.trim()
        renderUserList(searchInput.value.trim())
    })
}

function renderUserList(search) {
    const usersFound = allUsers.filter(user => {
        return user.name.toLowerCase().indexOf(search.toLowerCase()) > -1
    }).sort((a, b) => {
        return a.name.localeCompare(b.name)
    })

    let usersHTML = '<div>'
    usersFound.forEach(user => {
        const { picture, name, age } = user

        const userHTML = `
            <div class='user'>
                <div><img src ='${picture}' alt='${name}'></div>
                <div>${name}, ${age} anos</div>
            </div>
        `

        usersHTML += userHTML
    })
    usersHTML += '</div>'

    countUsers.textContent = `${usersFound.length} usuário(s) encontrado(s)`
    tabUsers.innerHTML = usersHTML

    renderStatistics(usersFound)
}

function renderStatistics(infoUsers) {
    const maleGender = infoUsers.filter(user => {
        return user.gender === 'male'
    })
    const femaleGender = infoUsers.filter(user => {
        return user.gender === 'female'
    })
    let totalAges = infoUsers.reduce((acc, curr) => acc + curr.age, 0)
    let averageAges = (totalAges / infoUsers.length).toFixed(2)

    totalMaleGender = maleGender.length
    totalFemaleGender = femaleGender.length

    formattedTotalAges = formatNumber(totalAges)
    formattedAverageAges = formatNumber(averageAges)
    let statisticsHTML = `
        <div>
            <ul>
                <li>Sexo masculino: ${totalMaleGender}</li>
                <li>Sexo feminino: ${totalFemaleGender}</li>
                <li>Soma das idades: ${formattedTotalAges}</li>
                <li>Média das idades: ${formattedAverageAges}</li>
            </ul>
        </div>
    `
    statistics.textContent = 'Estatísticas'
    tabStatistics.innerHTML = statisticsHTML
}

function formatNumber(number) {
    return numberFormat.format(number)
}