//1. Импортируйте данные из файлов в массивы аналогично тому, как было в уроке.

let persons = []
let specializations = []
let cities = []

Promise.all(
    [
        fetch('files/person.json'),
        fetch('files/specializations.json'),
        fetch('files/cities.json'),
    ]
).then(async ([personResponse, specializationsResponse, citiesResponse]) => {
    const personJson = await personResponse.json();
    const specializationsJson = await specializationsResponse.json();
    const citiesJson = await citiesResponse.json()
    return [personJson, specializationsJson, citiesJson];
}).then(response => {
    persons = response[0];
    specializations = response[1];
    cities = response[2];

    processData();
})

//2. Создайте самостоятельную функцию getInfo, которая будет возвращать в одной строке имя, фамилию и город
// пользователя, используя this. Эта функция будет использоваться для вывода полного имени в вашем коде,
// вызывать ее нужно будет с помощью метода call.
// Пример вывода: «Алексей Чеканов, Москва».
function getInfo() {
    let city = cities.find(city => city.id === this.personal.locationId).name
    return `${this.personal.firstName} ${this.personal.lastName}, ${city}`;
}

function processData() {

    // 3. Найдите среди пользователей всех дизайнеров, которые владеют Figma и выведите данные о них в консоль
    // с помощью getInfo.
    console.log('----------- 3 все дизайнеры, которые владеют Figma --------------------');
    let figmaDev = persons.filter(person => {
        return person.skills.findIndex(skill => skill.name.toLowerCase() === 'figma') > -1
            && getSpecialization.call(person) === 'designer';
    });
    figmaDev.forEach(person => {
        console.log(getInfo.call(person))
    })
    createBlock('3. Все дизайнеры, которые владеют Figma:', figmaDev)

    // 4. Найдите первого попавшегося разработчика, который владеет React.
    // Выведите в консоль через getInfo данные о нем.

    let reactDev = persons.find(person => {
        return person.skills.findIndex(skill => skill.name.toLowerCase() === 'react') > -1;
    });
    console.log('----------- 4 первый попавшийся разработчик, который владеет React --------------------');
    console.log(getInfo.call(reactDev))
    createBlock('4. Первый попавшийся разработчик, который владеет React:', getInfo.call(reactDev))

    // 5. Проверьте, все ли пользователи старше 18 лет. Выведите результат проверки в консоль.
    let isAllAdult = persons.every(person => {
        return getAge.call(person) >= 18;
    });
    console.log('----------- 5 все ли пользователи старше 18 лет --------------------');
    console.log(isAllAdult)
    createBlock('5. Все ли пользователи старше 18 лет:', isAllAdult)


    // 6. Найдите всех backend-разработчиков из Москвы, которые ищут работу на полный день и отсортируйте их в
    // порядке возрастания зарплатных ожиданий.

    let backendMoscowDevs = persons.filter(person => {
        let moscow = cities.find(city => city.name === 'Москва').id
        let isFullTime = person.request.findIndex(item => {
            return item.name.toLocaleLowerCase() === 'тип занятости' && item.value.toLocaleLowerCase() === 'полная'
        })
        return person.personal.locationId === moscow && isFullTime > -1 &&
            getSpecialization.call(person) === 'backend';
    }).sort((a, b) => {
        let salaryA = getSalary.call(a)
        let salaryB = getSalary.call(b)
        return salaryA - salaryB
    });

    console.log('----------- 6  backend-разработчики из Москвы --------------------');
    backendMoscowDevs.forEach(person => {
        console.log(getInfo.call(person), getSalary.call(person), getSpecialization.call(person));
    })
    createBlock('6. Backend-разработчики из Москвы:', backendMoscowDevs, true)

    // 7. Найдите всех дизайнеров, которые владеют Photoshop и Figma одновременно на уровне не ниже 6 баллов.

    let goodDesigners = persons.filter(person => {
        let photoShop = person.skills.findIndex(skill => skill.name.toLowerCase() === 'photoshop' && skill.level >= 6);
        let figma = person.skills.findIndex(skill => skill.name.toLowerCase() === 'figma' && skill.level >= 6);

        return photoShop > -1 && figma > -1 && getSpecialization.call(person) === 'designer';
    })

    console.log('----------- 7  дизайнеры Photoshop и Figma, уровень 6+ --------------------');
    goodDesigners.forEach(person => {
        console.log(getInfo.call(person), person);
    })
    createBlock('7. дизайнеры Photoshop и Figma, уровень 6+:', goodDesigners)
    // Соберите команду для разработки проекта:
    // - дизайнера, который лучше всех владеет Figma
    // - frontend разработчика с самым высоким уровнем знания Angular
    // - лучшего backend разработчика на Go
    // Выведите результат в консоль, используя getInfo.

    let dreamTeam = []

    let skills = {}

    persons.forEach(person => {
        person.skills.forEach(skill => {
            if (skills[skill.name]) {
                skills[skill.name] = Math.max(skill.level, skills[skill.name]);
            } else {
                skills[skill.name] = skill.level;
            }
        })
    })

    let necessarySkills = ['Figma', 'Angular', 'Go']

    necessarySkills.forEach(skill => {

        dreamTeam.push(persons.find(person => {
                return person.skills.findIndex(currentSkill => {
                    return currentSkill.name === skill & currentSkill.level === skills[skill]
                }) > -1;
            })
        )
    })

    console.log('----------- 8  команда для разработки проекта --------------------');
    dreamTeam.forEach(member => {
        console.log(getInfo.call(member))
    })
    createBlock('8. Команда для разработки проекта:', dreamTeam)
}


function getSalary() {
    return this.request.find(item => item.name.toLocaleLowerCase() === 'зарплата').value;
}

function getSpecialization() {
    return specializations.find(specialization => specialization.id === this.personal.specializationId).name
}

function getAge() {
    let now = new Date();
    let today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    let dateParts = this.personal.birthday.split('.');
    let birthDate = new Date(`${dateParts[2]}-${+dateParts[1]}-${dateParts[0]}`);
    let birthDateThisYear = new Date(now.getFullYear(), birthDate.getMonth(), birthDate.getDate());
    let age = today.getFullYear() - birthDate.getFullYear();
    if (today < birthDateThisYear) {
        age = age - 1
    }
    return age
}


function createBlock(titleText, items, addSalary= false) {
    let div = document.createElement('div');
    let title = document.createElement('h2')
    title.innerText = titleText
    let elem = document.createElement('ul')
    if (Array.isArray(items)) {

        items.forEach(item => {
            let li = document.createElement('li')
            li.innerText = addSalary ? `${getInfo.call(item)}, ${getSalary.call(item)}` : getInfo.call(item)
            elem.appendChild(li)
        })
    } else {
        let li = document.createElement('li')
        li.innerText = items
        elem.appendChild(li)
    }
    div.appendChild(title);
    div.appendChild(elem);
    document.body.appendChild(div);
}
