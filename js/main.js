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
            cardTitle: null,
            cardDesc: null,
            cardDeadline: null
        }
    },
    methods: {
        createCard () {
            let timeNow = new Date();
            let card = {
                title: this.cardTitle,
                desc: this.cardDesc,
                createTime: timeNow.getFullYear() + '-' + timeNow.getMonth() + '-' +  timeNow.getDate(),
                deadline: this.cardDeadline,
                changeTime: null,
                cardPosition: 1,
                cardEditing: false
            }

            this.columns[0].cards.push(card);

            this.cardTitle = null;
            this.cardDesc = null;
            this.cardDeadline = null;


            eventBus.$emit('update-data');
        }
    },
    mounted() {
        if (localStorage.data3 !== undefined) {
            let data = JSON.parse(localStorage.data3);
            this.columns = data.columns;
        }

        eventBus.$on('update-data', updateData = () => {
            console.log('LocalStorage обновлен')
            let columns = {columns: this.columns}
            localStorage.data3 = JSON.stringify(columns);
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
                    let cardForMove = this.columns[1].cards[i];
                    this.columns[1].cards.splice(i,1);
                    this.columns[2].cards.push(cardForMove);
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

    }
})

Vue.component('board-column', {
    template: `
    <div class="column">
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
    mounted() {

    }

})

Vue.component('board-card', {
    template: `
    <div>
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
        
        <button class="moveButton" @click="editCard"> 📝 </button>
        <button v-if="this.card.cardPosition === 1" class="moveButton" @click="removeCard"> ❌ </button>
        <button class="moveButton" @click="moveCard"> ➡️ </button>
        
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
            }
            if (this.card.cardPosition === 2) {
                eventBus.$emit('move-card-from-second-to-third', this.card.title);
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
                    this.card.cardEditing = false;
                    let timeChange = new Date()
                    this.card.changeTime = timeChange;
                    eventBus.$emit('update-data');
                }
            }
        }
    },
    mounted() {
    }

})



let eventBus = new Vue()


let app = new Vue({
    el: '#app',
})