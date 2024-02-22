Vue.component('board', {
    template: `
    <div class="board">
        <div class="cardForm">
            <input type="text" name="title" id="title" v-model="cardTitle">
            <input type="text" name="desc" id="desc" v-model="cardDesc">
            <input type="date" name="deadline" id="deadline" v-model="cardDeadline">
            <button @click="createCard">Добавить задачу</button>
        </div>
        
        <div class="columns">
            <board-column v-for="column in columns" :key="column.positon" :column="column"></board-column>
        </div>
        <h2 class="columnTitle">Избранное</h2>
        <div class="favorite">
            
            <board-card class="card" v-for="card in favorite" :key="card.id" :card="card"></board-card>
        </div>
        
        </div>
 `,
    data() {
        return {
            columns: [
                {
                    position: 1,
                    cards: []
                },
                {
                    position: 2,
                    cards: []
                },
                {
                    position: 3,
                    cards: []
                },
                {
                    position: 4,
                    cards: []
                }
            ],
            favorite: [],
            cardTitle: null,
            cardDesc: null,
            cardDeadline: null,
            idList: null,
        }
    },
    methods: {
        createCard () {

            if (this.cardTitle !== null && this.cardDesc !== null && this.cardDeadline !== null ){
                let timeNow = new Date();
                let yearNow = timeNow.getFullYear();
                let monthNow = timeNow.getMonth() + 1;
                let dateNow = timeNow.getDate();

                if (monthNow < 10) {
                    monthNow = '0' + monthNow;
                }

                if (dateNow < 10) {
                    dateNow = '0' + dateNow;
                }

                let card = {
                    id: this.idList,
                    title: this.cardTitle,
                    desc: this.cardDesc,
                    createTime: yearNow + '-' + monthNow + '-' + dateNow,
                    deadline: this.cardDeadline,
                    changeTime: null,
                    cardPosition: 1,
                    cardEditing: false,
                    returnReason: null,
                    cardReturning: false,
                    completeStatus: null,
                    completeTime: null,
                    inFavorite: false,
                }

                this.columns[0].cards.push(card);

                this.cardTitle = null;
                this.cardDesc = null;
                this.cardDeadline = null;
                this.idList += 1;

                eventBus.$emit('update-data');
            } else {
                alert('Не все данные были указаны');
            }
        }
    },
    mounted() {
        if (localStorage.data3 !== undefined) {
            let data = JSON.parse(localStorage.data3);
            this.columns = data.columns;
            this.idList = data.idList;
            this.favorite = data.favorite;
        }

        if (this.idList === null) {
            this.idList = 1;
        }


        eventBus.$on('update-data', updateData = () => {
            console.log('LocalStorage обновлен')
            let data = {columns: this.columns, favorite: this.favorite, idList: this.idList}
            localStorage.data3 = JSON.stringify(data);
        })

        eventBus.$on('move-card-from-first-to-second', moveFromFirstToSecond = (cardTitle) => {
            for (let i = 0; i < this.columns[0].cards.length; ++i) {
                if (this.columns[0].cards[i].title === cardTitle) {
                    this.columns[0].cards[i].cardPosition = 2;
                    let cardForMove = this.columns[0].cards[i];
                    this.columns[0].cards.splice(i,1);
                    this.columns[1].cards.push(cardForMove);
                }
            }
            eventBus.$emit('update-data');
        })

        eventBus.$on('move-card-from-second-to-third', moveFromSecondToThird = (cardTitle) => {
            for (let i = 0; i < this.columns[1].cards.length; ++i) {
                if (this.columns[1].cards[i].title === cardTitle) {
                    this.columns[1].cards[i].cardPosition = 3;
                    this.columns[1].cards[i].returnReason = null;
                    let cardForMove = this.columns[1].cards[i];
                    this.columns[1].cards.splice(i,1);
                    this.columns[2].cards.push(cardForMove);
                }
            }
            eventBus.$emit('update-data');
        })

        eventBus.$on('move-card-from-third-to-four', moveFromThirdToFour = (cardTitle) => {
            for (let i = 0; i < this.columns[2].cards.length; ++i) {
                if (this.columns[2].cards[i].title === cardTitle) {
                    this.columns[2].cards[i].cardPosition = 4;
                    let cardForMove = this.columns[2].cards[i];
                    this.columns[2].cards.splice(i,1);
                    this.columns[3].cards.push(cardForMove);
                }
            }
            eventBus.$emit('update-data');
        })
        eventBus.$on('move-card-from-third-to-second', moveFromThirdToSecond = (cardTitle) => {
            for (let i = 0; i < this.columns[2].cards.length; ++i) {
                if (this.columns[2].cards[i].title === cardTitle) {
                    this.columns[2].cards[i].cardPosition = 2;
                    let cardForMove = this.columns[2].cards[i];
                    this.columns[2].cards.splice(i,1);
                    this.columns[1].cards.push(cardForMove);
                }
            }
            eventBus.$emit('update-data');
        })

        eventBus.$on('remove-card-from-first', removeFromFirst = (cardTitle) => {
            for (let i = 0; i < this.columns[0].cards.length; ++i) {
                if (this.columns[0].cards[i].title === cardTitle) {
                    this.columns[0].cards.splice(i,1);
                }
            }
            eventBus.$emit('update-data');
        })

        eventBus.$on('add-to-favorite', addToFavorite = (id) => {
            let card;
            let type;

            for (let i = 0; i < this.columns[0].cards.length; ++i) {
                if (this.columns[0].cards[i].id === id) {
                    if (this.columns[0].cards[i].inFavorite === false) {
                        this.columns[0].cards[i].inFavorite = true;
                        type = 'add';
                    } else {
                        this.columns[0].cards[i].inFavorite = false;
                        type = 'remove';
                    }
                    card = this.columns[0].cards[i];
                }
            }
            for (let i = 0; i < this.columns[1].cards.length; ++i) {
                if (this.columns[1].cards[i].id === id) {
                    if (this.columns[1].cards[i].inFavorite === false) {
                        this.columns[1].cards[i].inFavorite = true;
                        type = 'add';
                    } else {
                        this.columns[1].cards[i].inFavorite = false;
                        type = 'remove';
                    }
                    card = this.columns[1].cards[i];
                }
            }
            for (let i = 0; i < this.columns[2].cards.length; ++i) {
                if (this.columns[2].cards[i].id === id) {
                    if (this.columns[2].cards[i].inFavorite === false) {
                        this.columns[2].cards[i].inFavorite = true;
                        type = 'add';
                    } else {
                        this.columns[2].cards[i].inFavorite = false;
                        type = 'remove';
                    }
                    card = this.columns[2].cards[i];
                }
            }
            for (let i = 0; i < this.columns[3].cards.length; ++i) {
                if (this.columns[3].cards[i].id === id) {
                    if (this.columns[3].cards[i].inFavorite === false) {
                        this.columns[3].cards[i].inFavorite = true;
                        type = 'add';
                    } else {
                        this.columns[3].cards[i].inFavorite = false;
                        type = 'remove';
                    }
                    card = this.columns[3].cards[i];
                }
            }

            if (type === 'add') {
                this.favorite.push(card);
            } else if (type === 'remove') {
                for (let i = 0; i < this.favorite.length; ++i) {
                    if (this.favorite[i].id === card.id) {
                        this.favorite.splice(i,1);
                    }
                }
            }



            eventBus.$emit('update-data');
        })

    }
})

Vue.component('board-column', {
    template: `
    <div class="column">
        <h2 class="columnTitle" v-if="column.position === 1">Запланированные задачи</h2>
        <h2 class="columnTitle" v-if="column.position === 2">Задачи в работе</h2>
        <h2 class="columnTitle" v-if="column.position === 3">Тестирование</h2>
        <h2 class="columnTitle" v-if="column.position === 4">Выполненые задачи</h2>
        <board-card class="card" v-for="card in column.cards" :key="card.title" :card="card"></board-card>
    </div>
 `,
    props: {
        column: Object
    },
    data() {
        return {

        }
    },
    methods: {

    },

})

Vue.component('board-card', {
    template: `
    <div>
        <button class="moveButton" @click="addToFavorite"> ⭐️ </button>
        <p v-if="this.card.cardEditing === false">{{ card.title }}</p>
        <p v-if="this.card.cardEditing === true"><input  type="text" name="title" id="title" v-model="card.title"></p>
        
        <p v-if="this.card.cardEditing === false">{{ card.desc }}</p>
        <p v-if="this.card.cardEditing === true"><input type="text" name="desc" id="desc" v-model="card.desc"></p>
        
        <p>Дедлайн:</p>
        <p v-if="this.card.cardEditing === false">{{ card.deadline }}</p>
        <p v-if="this.card.cardEditing === true"><input  type="date" name="deadline" id="deadline" v-model="card.deadline"></p>
        
        
        <p>Дата добавления:</p>
        <p>{{ card.createTime }}</p>
        
        <p v-if="this.card.changeTime !== null">Дата последнего редактирования:</p>
        <p v-if="this.card.changeTime !== null">{{ card.changeTime }}</p> 
        
        
        <p v-if="this.card.completeTime !== null">Дата выполнения:</p>
        <p v-if="this.card.completeTime !== null">{{ card.completeTime }}</p> 
        
        <p v-if="this.card.returnReason !== null">Причина возврата:</p>
        <p v-if="this.card.returnReason !== null && this.card.cardReturning === false">{{ card.returnReason }}</p>
        <p v-if="this.card.cardReturning === true"><input  type="text" name="returnReason" id="returnReason" v-model="card.returnReason" placeholder="Введите причину возврата"></p>
        
        <button class="moveButton" @click="editCard" v-if="this.card.cardPosition !== 4"> 📝 </button>
        <button v-if="this.card.cardPosition === 1" class="moveButton" @click="removeCard"> ❌ </button>
        <button v-if="this.card.cardPosition === 3" class="moveButton" @click="returnCard"> ⚠️ </button>
        <button class="moveButton" @click="moveCard" v-if="this.card.cardPosition !== 4"> ➡️ </button>
        
        <div class="inTime" v-if="card.completeStatus === true">Задача выполнена вовремя</div>
        <div class="outTime" v-if="card.completeStatus === false">Задача просрочена</div>
        
    </div>
 `,
    props: {
        card: Object
    },
    data() {
        return {
        }
    },
    methods: {
        moveCard () {
            if (this.card.cardPosition === 1) {
                eventBus.$emit('move-card-from-first-to-second', this.card.title);
                return
            }
            if (this.card.cardPosition === 2) {
                eventBus.$emit('move-card-from-second-to-third', this.card.title);
                return
            }
            if (this.card.cardPosition === 3) {

                let completeTime = new Date ();

                let yearComplete = completeTime.getFullYear();
                let monthComplete = completeTime.getMonth() + 1;
                let dateComplete = completeTime.getDate();

                if (monthComplete < 10) {
                    monthComplete = '0' + monthComplete;
                }

                if (dateComplete < 10) {
                    dateComplete = '0' + dateComplete;
                }

                this.card.completeTime = yearComplete + '-' + monthComplete + '-' + dateComplete;


                if (this.card.deadline > this.card.completeTime) {
                    this.card.completeStatus = true;
                } else {
                    this.card.completeStatus = false;
                }

                eventBus.$emit('move-card-from-third-to-four', this.card.title);

                return
            }

        },
        removeCard () {
            eventBus.$emit('remove-card-from-first', this.card.title);
        },
        editCard () {
            if (this.card.cardPosition === 1 || this.card.cardPosition === 2 || this.card.cardPosition === 3) {
                if (this.card.cardEditing === false) {
                    this.card.cardEditing = true;
                } else {
                    let timeChange = new Date()

                    let yearChange = timeChange.getFullYear();
                    let monthChange = timeChange.getMonth() + 1;
                    let dateChange = timeChange.getDate();

                    if (monthChange < 10) {
                        monthChange = '0' + monthChange;
                    }

                    if (dateChange < 10) {
                        dateChange = '0' + dateChange;
                    }

                    this.card.changeTime = yearChange + '-' + monthChange + '-' + dateChange;
                    this.card.cardEditing = false;
                    eventBus.$emit('update-data');
                }
            }
        },
        returnCard () {
            if (this.card.cardReturning === false) {
                this.card.cardReturning = true;
            } else {
                eventBus.$emit('move-card-from-third-to-second', this.card.title);
                this.card.cardReturning = false;
                eventBus.$emit('update-data');
            }
        },
        addToFavorite () {
            eventBus.$emit('add-to-favorite', this.card.id);
        },
    },
    mounted() {
    }

})



let eventBus = new Vue()


let app = new Vue({
    el: '#app',
})