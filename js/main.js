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
        
        {{ columns }}
        
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
                cardPosition: 1
            }

            this.columns[0].cards.push(card);

            this.cardTitle = null;
            this.cardDesc = null;
            this.cardDeadline = null;


            let columns = {columns: this.columns}
            localStorage.data3 = JSON.stringify(columns);
        }
    },
    mounted() {
        if (localStorage.data3 !== undefined) {
            let data = JSON.parse(localStorage.data3);
            this.columns = data.columns;
        }


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
        eventBus.$on('move-card-from-first-to-second', moveFromFirstToSecond = (cardTitle) => {
            for (let i = 0; i < this.columns[0].cards.length; ++i) {
                if (this.columns[0].cards[i].title === cardTitle) {
                    let cardForMove = this.columns[0].cards[i];
                    this.columns[0].cards.splice(i,1);
                    this.columns[1].cards.push(cardForMove);
                }
            }
        })

    }

})

Vue.component('board-card', {
    template: `
    <div>
        <p>{{ card.title }}</p>
        <p>{{ card.desc }}</p>
        <p>Дата добавления:</p>
        <p>{{ card.createTime }}</p>
        <p>Дедлайн:</p>
        <p>{{ card.deadline }}</p>
        
        <button class="moveButton" @click="moveCard"> ></button>
        
        {{ this.card }}
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

        }
    },
    mounted() {
    }

})



let eventBus = new Vue()


let app = new Vue({
    el: '#app',
})