//DOM取得
const playerNameInput = document.getElementById("player-name-input")
const saveNameBtn = document.getElementById("save-name-btn")
const playerStatus = document.getElementById("player-status")
const questInput = document.getElementById("quest-input")
const questSize = document.getElementById("quest-size")
const addBtn = document.getElementById("add-btn")
const questItems = document.getElementById("quest-items")
const deadlineInput = document.getElementById("deadline-input")
const levelUpMessage = document.getElementById("levelup-message")
const expPopup = document.getElementById("exp-popup")
const confettiContainer = document.getElementById("confetti-container")
const todayTitle = document.getElementById("today-title")
const toTopBtn = document.getElementById("to-top")
const applyCategoryBtn = document.getElementById("apply-category-btn")
const bulkCategoryInput = document.getElementById("bulk-category-input")
const categoryInput = document.getElementById("category-input")
const startCategoryBtn = document.getElementById("start-category-btn")
const cancelCategoryBtn = document.getElementById("cancel-category-btn")
const completedTitle = document.getElementById("completed-title")
const completedQuestItems = document.getElementById("completed-quest-items")
const questListSection = document.getElementById("quest-list")
const categoryFilter = document.getElementById("category-filter")
const helpBtn = document.getElementById("help-btn")
const helpModal = document.getElementById("help-modal")
const closeHelpBtn = document.getElementById("close-help-btn")
const startFirstQuestBtn = document.getElementById("start-first-quest")
const recommendedQuest = document.getElementById("recommended-quest")


let levelUpTimer = null
let isCategorySelecting = false
let selectedCategory = ""


window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            toTopBtn.classList.add('show');
        } else {
            toTopBtn.classList.remove('show');
        }
    });

    toTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });


//保存機能
const savedQuests = localStorage.getItem("quests")
const savedPlayer = localStorage.getItem("player")
const hasSeenHelp = localStorage.getItem("hasSeenHelp")

let quests = savedQuests ? JSON.parse(savedQuests) : []

let player = savedPlayer
    ? JSON.parse(savedPlayer)
    : {
        name: "名無しの冒険者",
        level: 1,
        currentExp: 0,
        totalExp: 0,
        todayExp: 0,
        lastAccessDate: getTodayText(),
        lastPlayDate: "",
        streak: 0,
        achievements: []
    }

let needsSave = false

if(player.achievements === undefined) {
    player.achievements = []
    needsSave = true
}
if(player.streak === undefined) {
    player.streak = 0
    needsSave = true
}
if(player.lastPlayDate === undefined) {
    player.lastPlayDate = ""
    needsSave = true
}
if(player.todayExp === undefined) {
    player.todayExp = 0
    needsSave = true
}
if(player.lastAccessDate === undefined) {
    player.lastAccessDate = getTodayText()
    needsSave = true
}
if(needsSave) {
    saveData()
}
let animatedExp = player.currentExp


function expToNextLevel(level) {
    return 100 + (level - 1) * 10
}



//プレイヤーステータスの描画
function renderPlayerStatus() {
    const nextLevelExp = expToNextLevel(player.level)
    const remainExp = nextLevelExp - player.currentExp
    const ratio = Math.min(animatedExp / nextLevelExp, 1)
    const title = getTitleByLevel(player.level)
    const todayText = getTodayText()
    const achievementList = player.achievements
        .map((key) => `<li>${getAchievementLabel(key)}</li>`)
        .join("")

    playerStatus.innerHTML = `
    <h2>プレイヤーステータス</h2>

    <div class="status-wrapper">
        <div class="status-left">
            <p>なまえ: ${player.name}</p>
            <p>称号: ${title}</p>
            <p>今日の日付: ${todayText}</p>
            <p>連続冒険日数: ${player.streak}</p>
            <p>実績解除数: ${player.achievements.length}</p>
            <ul>${achievementList}</ul>
        </div>

        <div class="status-right">
            <p class="level-text">Lv. ${player.level}</p>

            <div class="exp-bar">
                <div class="exp-fill" style="transform: scaleX(${ratio})"></div>
            </div>

            <p id="today-exp-text">今日の獲得Exp: ${player.todayExp}</p>
            <p id="current-exp-text">現在Exp: ${player.currentExp} / ${nextLevelExp}</p>
            <p id="total-exp-text">総Exp: ${player.totalExp}</p>
            <p id="remain-exp-text">次のレベルまであと: ${remainExp}Exp</p>
        </div>
    </div>

    
`
}


function updateExpBarOnly() {
    const nextLevelExp = expToNextLevel(player.level)
    const ratio = Math.min(animatedExp / nextLevelExp, 1)

    const expFill = document.querySelector(".exp-fill")
    if(expFill) {
        expFill.style.transform = `scaleX(${ratio})`
    }
}


function updateExpTexts() {
    const nextLevelExp = expToNextLevel(player.level)
    const remainExp = nextLevelExp - player.currentExp

    const todayExpText = document.getElementById("today-exp-text")
    const currentExpText = document.getElementById("current-exp-text")
    const totalExpText = document.getElementById("total-exp-text")
    const remainExpText = document.getElementById("remain-exp-text")

    if(todayExpText) {
        todayExpText.textContent = `今日の獲得Exp: ${player.todayExp}`
    }
    if(currentExpText) {
        currentExpText.textContent = `現在Exp: ${player.currentExp} / ${nextLevelExp}`
    }
    if(totalExpText) {
        totalExpText.textContent = `総Exp: ${player.totalExp}`
    }
    if(remainExpText) {
        remainExpText.textContent = `次のレベルまであと: ${remainExp}Exp`
    }
}


//保存処理
function saveData() {
    localStorage.setItem("quests", JSON.stringify(quests))
    localStorage.setItem("player", JSON.stringify(player))
}

//初期状態
function setQuests(updater) {
    quests = updater(quests)
    saveData()
    render()
}


//称号獲得システム
function getTitleByLevel(level) {
    if(level >= 100) return "伝説の冒険者"
    if(level >= 90) return "神話の冒険者"
    if(level >= 80) return "熟練の冒険者"
    if(level >= 70) return "ベテラン冒険者"
    if(level >= 60) return "大人気な冒険者"
    if(level >= 50) return "一流の冒険者"
    if(level >= 40) return "優秀な冒険者"
    if(level >= 30) return "有名冒険者"
    if(level >= 20) return "人気の冒険者"
    if(level >= 10) return "一人前の冒険者"
    if(level >= 5) return "駆け出しの冒険者"
    return "見習い冒険者"
}


//実績解除システム
function unlockAchievement(key) {
    if(player.achievements.includes(key)) return

    player.achievements.push(key)
    saveData()
}


//実績一覧
function getAchievementLabel(key) {
    if(key === "first-clear") return "はじめての達成！"
    if(key === "level-5") return "見習い卒業！"
    if(key === "large-quest-clear") return "大いなる一歩"
    return key
}


//連続日数更新用の関数
function updateStreakOnQuestClear() {
    const todayText = getTodayText()

    if(player.lastPlayDate === todayText) {
        return
    }
    if(!player.lastPlayDate) {
        player.streak = 1
        player.lastPlayDate = todayText
        saveData()
        return
    }
    const today = new Date(todayText)
    const lastDate = new Date(player.lastPlayDate)

    today.setHours(0, 0, 0, 0)
    lastDate.setHours(0, 0, 0, 0)

    const diff = today - lastDate
    const oneDay = 24 * 60 * 60 * 1000

    if(diff === oneDay) {
        player.streak++
    } else if(diff > oneDay) {
        player.streak = 1
    }
    player.lastPlayDate = todayText
    saveData()
}


//経験値獲得ポップアップ
let expPopupTimer = null

function showQuestStartPopup() {
    const popup = document.getElementById("quest-start-popup");

    popup.classList.remove("hidden");
    popup.classList.add("show");

    setTimeout(() => {
        popup.classList.remove("show");

        setTimeout(() => {
            popup.classList.add("hidden");
        }, 300);
    }, 1000);
}

function showExpPopup(exp) {
    expPopup.removeAttribute("hidden")
    expPopup.classList.remove("hidden")
    expPopup.textContent = `クエストクリア!   Exp +${exp}`
    expPopup.classList.add("show")

    if(expPopupTimer) {
        clearTimeout(expPopupTimer)
    }

    expPopupTimer = setTimeout(() => {
        expPopup.classList.remove("show")
        expPopupTimer = null
    }, 3000)
}


//経験値バー演出
function animateExpGain(amount) {
    function animateStep(remainingExp) {
        if(remainingExp <= 0) {
            saveData()
            render()
            return
        }

        const nextLevelExp = expToNextLevel(player.level)
        const expNeeded = nextLevelExp - player.currentExp

        const gainThisStep = Math.min(remainingExp, expNeeded)

        const startAnimatedExp = animatedExp
        const startCurrentExp = player.currentExp
        const startTotalExp = player.totalExp
        const startTodayExp = player.todayExp

        const targetAnimatedExp = startCurrentExp + gainThisStep
        const duration = 1200
        const startTime = performance.now()

        function update(now) {
            const elapsed = now - startTime
            const progress = Math.min(elapsed / duration, 1)

            animatedExp =
                startAnimatedExp + (targetAnimatedExp - startAnimatedExp) * progress

            updateExpBarOnly()

            if(progress < 1) {
                requestAnimationFrame(update)
            } else {
                animatedExp = targetAnimatedExp
                player.currentExp = startCurrentExp + gainThisStep
                player.totalExp = startTotalExp + gainThisStep
                player.todayExp = startTodayExp + gainThisStep

                updateExpTexts()

                if(player.currentExp >= nextLevelExp) {
                    player.currentExp = 0
                    player.level++

                    if(player.level >= 5) {
                        unlockAchievement("level-5")
                    }

                    showLevelUp()
                    launchLevelUpConfetti()

                    animatedExp = 0
                    render()

                    setTimeout(() => {
                        animateStep(remainingExp - gainThisStep)
                    }, 900)
                } else {
                    saveData()
                    render()
                }
            }
        }

        requestAnimationFrame(update)
    }

    animateStep(amount)
}


//今日の日付
function getTodayText() {
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, "0")
    const date = String(today.getDate()).padStart(2, "0")

    return `${year}-${month}-${date}`
}


//期限情報
function getDeadlineInfo(deadline) {
    if(!deadline) {
        return {
        text: "期限: なし",
        }
    }

    const today = new Date()
    const deadlineDate = new Date(deadline)

    today.setHours(0, 0, 0, 0)
    deadlineDate.setHours(0, 0, 0, 0)

    const diff = deadlineDate - today
    const oneDay = 24 * 60 * 60 * 1000
    const diffDays = Math.floor(diff / oneDay)

    if(diffDays === 1) {
        return {
            text: `期限: ${deadline} (明日まで)`
        }
    } else if(diffDays === 0) {
        return {
            text: `期限: ${deadline} (今日まで)`
        }
    } else if(diffDays < 0) {
        return {
            text: `期限切れ: ${deadline} (${Math.abs(diffDays)}日経過)`
        }
    } else {
        return {
            text: `期限: ${deadline} (あと${diffDays}日)`
        }
    }
}


//ソート機能
function getSortedQuests(quests) {

const activeQuests = quests.filter((quest) => !quest.completed)

const withDeadline = activeQuests
    .filter((quest) => quest.deadline)
    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))

const noDeadline = activeQuests
    .filter((quest) => !quest.deadline)
    .sort((a, b) => b.id - a.id)

const completedQuests = quests
    .filter((quest) => quest.completed)
    .sort((a, b) => b.id - a.id)

return [
    ...withDeadline,
    ...noDeadline,
    ...completedQuests
]

}

function renderCategoryFilterOptions(quests) {
    const categories = [...new Set(
        quests
            .map((quest) => quest.category?.trim())
            .filter((category) => category)
    )]

    categoryFilter.innerHTML = `<option value="">すべてのカテゴリ</option>`

    categories.forEach((category) => {
        const option = document.createElement("option")
        option.value = category
        option.textContent = category
        categoryFilter.appendChild(option)
    })

    if (!categories.includes(selectedCategory)) {
        selectedCategory = ""
    }

    categoryFilter.value = selectedCategory
}

categoryFilter.addEventListener("change", () => {
    selectedCategory = categoryFilter.value
    render()
})

//今日のクエスト取得関数
function getTodayQuests(quests) {
    const today = getTodayText()
    return quests.filter((quest) => {
        return (
            !quest.completed &&
            quest.deadline === today
        )
    })
}
    

//レベルアップ表示
function showLevelUp() {

    levelUpMessage.classList.remove("hidden")

    if(levelUpTimer) {
        clearTimeout(levelUpTimer)
    }
    levelUpTimer = setTimeout(() => {
        levelUpMessage.classList.add("hidden")
        levelUpTimer = null
    }, 5000)
}


function launchLevelUpConfetti() {
    const colors = ["#ffd700", "#ff4d6d", "#4caf50", "#4da6ff", "#ffffff"]

    for(let i = 0; i < 24; i++) {
        const piece = document.createElement("div")
        piece.classList.add("confetti")

        if(i % 2 === 0) {
            piece.style.left = "0px"
            piece.style.setProperty("--x", `${Math.random() * 250 + 120}px`)
        } else {
            piece.style.left = "calc(100% - 12px)"
            piece.style.setProperty("--x", `${-(Math.random() * 250 + 120)}px`)
        }

        piece.style.top = "45%"
        piece.style.setProperty("--y", `${Math.random() * 220 - 120}px`)
        piece.style.setProperty("--r", `${Math.random() * 720 - 360}deg`)
        piece.style.background = colors[Math.floor(Math.random() * colors.length)]
        piece.style.width = `${Math.random() * 10 + 8}px`
        piece.style.height = piece.style.width

        confettiContainer.appendChild(piece)

        setTimeout(() => {
            piece.remove()
        }, 1300)
    }
}


//その日の経験値量
function checkDailyReset() {
    const todayText = getTodayText()

    if(player.lastAccessDate !== todayText) {
        player.todayExp = 0
        player.lastAccessDate = todayText
        saveData()
    }
}

//指示ボタンの開閉関数
function openHelpModal() {
    helpModal.classList.remove("hidden")
}

function closeHelpModal() {
    helpModal.classList.add("hidden")
}

function startFirstQuestFromHelp() {
    closeHelpModal()
    if (questInput) {
        questInput.focus()
    }
}

function getRecommendedQuest(quests) {
    const activeQuests = quests.filter((quest) => !quest.completed)

    if (activeQuests.length === 0) return null

    const sorted = [...activeQuests].sort((a, b) => {
        const aHasDeadline = !!a.deadline
        const bHasDeadline = !!b.deadline

        if (aHasDeadline && bHasDeadline) {
            const diff = new Date(a.deadline) - new Date(b.deadline)
            if (diff !== 0) return diff
        }

        if (aHasDeadline && !bHasDeadline) return -1
        if (!aHasDeadline && bHasDeadline) return 1

        return b.id - a.id
    })

    return sorted[0]
}

//投影イベント
function render() {
    checkDailyReset()
    renderPlayerStatus()

    questItems.innerHTML = ""
    completedQuestItems.innerHTML = ""

    const todayQuests = getTodayQuests(quests)
    const sortedQuests = getSortedQuests(quests)
    const activeQuests = sortedQuests.filter((quest) => !quest.completed)
    const completedQuests = sortedQuests.filter((quest) => quest.completed)

    renderCategoryFilterOptions(quests)

    const filteredActiveQuests = selectedCategory
        ? activeQuests.filter((quest) => quest.category?.trim() === selectedCategory)
        : activeQuests

    const filteredTodayQuests = selectedCategory
        ? todayQuests.filter((quest) => quest.category?.trim() === selectedCategory)
        : todayQuests

    const recommended = getRecommendedQuest(quests)

if (recommended) {
    recommendedQuest.classList.remove("hidden")
    recommendedQuest.innerHTML = `
        <h3>今日のおすすめクエスト</h3>
        <p>🔥 今日の最優先クエスト</p>
        <p data-id="${recommended.id}" class="recommended-item">
            ${recommended.title}
        </p>
    `
} else {
    recommendedQuest.classList.add("hidden")
}

    completedQuests
    
    if (filteredTodayQuests.length > 0) {
        todayTitle.classList.remove("hidden")
        todayTitle.textContent = `今日のクエスト (${filteredTodayQuests.length}件)`
    } else {
        todayTitle.classList.add("hidden")
    }

    const filteredCompletedQuests = selectedCategory
    ? completedQuests.filter(q => q.category?.trim() === selectedCategory)
    : completedQuests

    filteredActiveQuests.forEach((quest) => {
        questItems.appendChild(createQuestItem(quest))
    })

    filteredCompletedQuests.forEach((quest) => {
        completedQuestItems.appendChild(createQuestItem(quest))
    })

    if (filteredCompletedQuests.length > 0) {
        completedTitle.classList.remove("hidden")
        completedQuestItems.classList.remove("hidden")
        completedTitle.textContent = `達成済みクエスト (${filteredCompletedQuests.length}件)`
    } else {
        completedTitle.classList.add("hidden")
        completedQuestItems.classList.add("hidden")
    }
}

function createQuestItem(quest) {
    const li = document.createElement("li")

    const today = getTodayText()

    if(!quest.completed && quest.deadline === today) {
        li.classList.add("today-quest")
    }

    const deadlineInfo = getDeadlineInfo(quest.deadline)
    

    const titleSpan = document.createElement("span")
    titleSpan.className = "quest-title"
    titleSpan.textContent = quest.title

    const metaRow = document.createElement("div")
    metaRow.className = "quest-meta"

    const deadlineSpan = document.createElement("span")
    deadlineSpan.className = "quest-deadline"
    deadlineSpan.textContent = deadlineInfo.text

    if (quest.deadline === today) {
        deadlineSpan.classList.add("deadline-today")
    }

    const sizeSpan = document.createElement("span")
    sizeSpan.className = `quest-size size-${quest.size}`
    sizeSpan.textContent = `(${getSizeLabel(quest.size)})`

    let categorySpan = null

    if(quest.category) {
        categorySpan = document.createElement("span")
        categorySpan.className = "quest-category"
        categorySpan.textContent = `[${quest.category}]`
    }

    const selectCheckbox = document.createElement("input")
    selectCheckbox.type = "checkbox"
    selectCheckbox.className = "quest-select-checkbox"
    selectCheckbox.dataset.id = quest.id

    if (!isCategorySelecting) {
        selectCheckbox.style.display = "none"
    }

    const completeBtn = document.createElement("button")
    completeBtn.textContent = quest.completed ? "報告済" : "達成報告"
    completeBtn.dataset.id = quest.id
    completeBtn.dataset.type = "toggle"
    completeBtn.className = "btn btn-primary btn-complete"
    if (quest.completed) {
        completeBtn.disabled = true
    }

    const editBtn = document.createElement("button")
    editBtn.textContent = "🖊"
    editBtn.dataset.id = quest.id
    editBtn.dataset.type = "edit"
    editBtn.className = "btn btn-icon btn-edit"
    editBtn.title = "クエストを編集"

    const deleteBtn = document.createElement("button")
    deleteBtn.textContent = "🗑"
    deleteBtn.dataset.id = quest.id
    deleteBtn.dataset.type = "delete"
    deleteBtn.className = "btn btn-icon btn-delete"
    deleteBtn.title = "クエストを削除"

    const left = document.createElement("div")
    left.className = "quest-left"

    const right = document.createElement("div")
    right.className = "quest-right"

    metaRow.appendChild(deadlineSpan)
    metaRow.appendChild(sizeSpan)

    if(categorySpan){
        metaRow.appendChild(categorySpan)
    }

    left.appendChild(selectCheckbox)
    left.appendChild(titleSpan)
    left.appendChild(metaRow)

    right.appendChild(completeBtn)
    right.appendChild(editBtn)
    right.appendChild(deleteBtn)

    li.appendChild(left)
    li.appendChild(right)

    if (quest.completed) {
        li.style.opacity = "0.5"
        titleSpan.style.textDecoration = "line-through"
    }

    return li
}

function applyCategoryToSelectedQuests(category, selectedIds) {
    quests = quests.map((quest) => {
        if (selectedIds.includes(quest.id)) {
            return {
                ...quest,
                category
            }
        }
        return quest
    })
    saveData()
}

function handleApplyCategory() {
    const category = bulkCategoryInput.value.trim()

    if (!category) {
        alert("カテゴリ名を入力してください")
        return
    }

    const checkedBoxes = document.querySelectorAll(".quest-select-checkbox:checked")
    const selectedIds = Array.from(checkedBoxes).map((checkbox) => Number(checkbox.dataset.id))

    if (selectedIds.length === 0) {
        alert("クエストを選択してください")
        return
    }

    applyCategoryToSelectedQuests(category, selectedIds)
    bulkCategoryInput.value = ""
    finishCategorySelection()
}



//日数計算関数
function getDaysUntil(deadline) {
    const today = new Date()
    const end = new Date(deadline)

    today.setHours(0, 0, 0, 0)
    end.setHours(0, 0, 0, 0)

    const diff = end - today
    return Math.floor(diff / (1000 * 60 * 60 * 24)) + 1
}

//バリエーション関数
function validateQuest(size, deadline) {
    if(!deadline) {
        return "期限を設定してください"
    }

    const days = getDaysUntil(deadline)

    if(days <= 0) {
        return "今日以降の日付を設定してください"
    }

    if(size === "small" && days > 3) {
        return "小クエストは3日以内に完了する必要があります"
    }
    if(size === "middle" && (days < 4 ||days > 7)) {
        return "中クエストは4~7日以内に完了する必要があります"
    }
    if(size === "large" && days < 8) {
        return "大クエストは8日以上に設定する必要があります"
    }
    return null

}

function startCategorySelection() {
    isCategorySelecting = true
    startCategoryBtn.classList.add("hidden")
    applyCategoryBtn.classList.remove("hidden")
    cancelCategoryBtn.classList.remove("hidden")
    render()
}

function finishCategorySelection() {
    isCategorySelecting = false
    startCategoryBtn.classList.remove("hidden")
    applyCategoryBtn.classList.add("hidden")
    cancelCategoryBtn.classList.add("hidden")
    render()
}



function cancelCategorySelection() {
    bulkCategoryInput.value = ""
    finishCategorySelection()
}

//追加するイベント
function addQuests() {
    const title = questInput.value.trim()
    const size = questSize.value
    const deadline = deadlineInput.value
    const category = categoryInput.value.trim()

    if(!title) {
        alert("クエスト名を入力してください")
        return
    }

    if(!size) {
        alert("クエストサイズを選択してください")
        return 
    }

    const error = validateQuest(size, deadline)

    if(error) {
        alert(error)
        return
    }

    const newQuest = {
        id: Date.now(),
        title,
        size,
        deadline,
        category,
        completed: false
    }

    setQuests((currentQuests) => {
        return [...currentQuests, newQuest]
    })

    showQuestStartPopup()

    questInput.value = ""
    questSize.value = ""
    deadlineInput.value = ""
    categoryInput.value = ""
    questInput.focus()
}




//名前保存イベント
saveNameBtn.addEventListener("click", () => {
    const name = playerNameInput.value.trim()
    if(!name) return
    player.name = name
    saveData()
    render()
})


//経験値の基準
function getExpBySize(size) {
    if(size === "small") return 10
    if(size === "middle") return 50
    if(size === "large") return 100
    return 0
}


function getSizeLabel(size) {
    if(size === "small") return "小クエスト"
    if(size === "middle") return "中クエスト"
    if(size === "large") return "大クエスト"
    return size
}



//削除・編集ボタン
questListSection.addEventListener("click",(e) => {
    if(!e.target.dataset.id) return

    const type = e.target.dataset.type
    if(!type) return

    const id = Number(e.target.dataset.id)

    if(type === "toggle") {
    const targetQuest = quests.find(q => q.id === id)
    
    if(!targetQuest) return
    if(targetQuest.completed) return

    const li = e.target.closest("li")
    if(li) {
        li.classList.add("complete-animate")
        setTimeout(() => {
            li.classList.remove("complete-animate")
        }, 400)
    }

    const gainedExp = getExpBySize(targetQuest.size)

    // toggleはExpアニメ中の全体renderを避けるため、setQuestsを使わず直接更新
    quests = quests.map((quest) => {
        if(quest.id === id) {
            return {
                ...quest,
                completed: true
            }
        }
        return quest
    })

    saveData()

    updateStreakOnQuestClear()
    unlockAchievement("first-clear")

    if(targetQuest.size === "large") {
        unlockAchievement("large-quest-clear")
    }

    showExpPopup(gainedExp)
    animateExpGain(gainedExp)
}

    if(type === "delete") {
        setQuests((currentQuests) => {
            return currentQuests.filter((quest) => quest.id !== id)
        })
    }

    if(type === "edit") {
    const targetQuest = quests.find((quest) => quest.id === id)

    if(!targetQuest) return

    questInput.value = targetQuest.title
    questSize.value = targetQuest.size
    deadlineInput.value = targetQuest.deadline || ""
    categoryInput.value = targetQuest.category || ""

    setQuests((currentQuests) => {
        return currentQuests.filter((quest) => quest.id !== id)
    })
}

})
if(startCategoryBtn) {
    startCategoryBtn.addEventListener("click", startCategorySelection)
}
if(cancelCategoryBtn) {
    cancelCategoryBtn.addEventListener("click", cancelCategorySelection)
}
if(applyCategoryBtn) {
    applyCategoryBtn.addEventListener("click", handleApplyCategory)
}
if(addBtn) {
    addBtn.addEventListener("click", addQuests)
}
if (!hasSeenHelp && helpBtn) {
    helpBtn.classList.add("first-time")
}
if (helpBtn) {
    helpBtn.addEventListener("click", openHelpModal)
}

if (closeHelpBtn) {
    closeHelpBtn.addEventListener("click", closeHelpModal)
}

if (helpModal) {
    helpModal.addEventListener("click", (e) => {
        if (e.target.classList.contains("help-modal-overlay")) {
            closeHelpModal()
        }
    })
}
if (!hasSeenHelp) {
    openHelpModal()
    localStorage.setItem("hasSeenHelp", "true")
}

if (startFirstQuestBtn) {
    startFirstQuestBtn.addEventListener("click", startFirstQuestFromHelp)
}
playerNameInput.value = player.name
render()

recommendedQuest.addEventListener("click", (e) => {
    if (!e.target.dataset.id) return

    const id = Number(e.target.dataset.id)
    const targetButton = document.querySelector(`button[data-id="${id}"][data-type="toggle"]`)

    if (targetButton) {
    const li = targetButton.closest("li")
    if (li) {
        li.scrollIntoView({ behavior: "smooth", block: "center" })

        li.classList.add("highlight")
        setTimeout(() => {
            li.classList.remove("highlight")
        }, 1000)
    }
}
})
