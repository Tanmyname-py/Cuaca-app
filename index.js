let isChange = []
const inputKabupaten = document.getElementById('kabupaten');
const inputKecamatan = document.getElementById('kecamatan');
const inputDesa = document.getElementById('desa');

inputKabupaten.addEventListener('change', async (e) => {
    const optionKab = e.target.value;
    if (isChange[0]) {
        inputKecamatan.innerHTML = '<option value="">Kec</option>'
        isChange[0] = false;
    }
    if (optionKab) {
        try {
            isChange[0] = true;
            const kecamatan = await fetch(`http://localhost:3000/kecamatan?code=${optionKab}`);
            const listKecamatan = await kecamatan.json();
            listKecamatan.data.forEach(d => {
                const option = document.createElement('option');
                option.value = d.code
                option.textContent = d.name;
                inputKecamatan.appendChild(option);
            });
        } catch (error) {
            console.error(error.message)
        }
    }
});

inputKecamatan.addEventListener('change', async (e) => {
    const optionKec = e.target.value;
    if (isChange[1]) {
        inputDesa.innerHTML = `<option value="">Kel/Desa</option>`;
        isChange[1] = false;
    }
    if (optionKec) {
        try {
            isChange[1] = true;
            const desa = await fetch(`http://localhost:3000/desa?code=${optionKec}`);
            const listDesa = await desa.json();
            listDesa.data.map(d => {
                const option = document.createElement('option');
                option.value = d.code;
                option.textContent = d.name;
                inputDesa.appendChild(option);
            })
        } catch (error) {
            console.error(error.message)
        }
    }
});


inputDesa.addEventListener('change', async (e) => {
    function formatWaktu(time) {
        return time < 10 ? time.toString().padStart(2, '0') : time;
    }
    const code = e.target.value;
    let perkiraanSuhu = '';
    const hari = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jum'at", "Sabtu"];
    const reqcuaca = await fetch(`http://localhost:3000/cuaca?code=${code}`);
    if (reqcuaca.ok) {
        document.querySelector('.card-cuaca').classList.add('display');
        let date;
        let idxCuaca = 0;
        let result = await reqcuaca.json();
        const cuaca = result.data[0].cuaca[0];
        for (let dataCuaca of cuaca) {
            idxCuaca++;
            let local_datetime = new Date(dataCuaca.local_datetime);
            let now = new Date();
            if (local_datetime.getDate() === now.getDate() && local_datetime.getHours() > now.getHours()) {
                date = new Date(dataCuaca.local_datetime)
                break;
            } else {
                date = new Date();
            }
        }

        const kecamatan = result.lokasi.kecamatan;
        const desa = result.lokasi.desa;
        let suhu = cuaca[idxCuaca].t;
        let weather_desc = cuaca[idxCuaca].weather_desc;
        const statistik = [
            { label: 'Kelembapan', value: `${cuaca[idxCuaca].hu || '0'}%` },
            { label: 'Angin', value: `${cuaca[idxCuaca].ws || '0'}km/jam` },
            { label: 'Hujan', value: `${cuaca[idxCuaca].tp || '0'}mm` },

        ].map(d => `
            <p><span class="label">${d.label}</span> <b class="value">${d.value}</b></p> 
        `).join("");
        for (let i = 0; i <= 3; i++) {
            perkiraanSuhu += `
    <li>
        <p class="p-waktu">${formatWaktu(new Date(cuaca[i].local_datetime).getHours())}:${formatWaktu(new Date(cuaca[i].local_datetime).getMinutes())}</p>
        <p class="p-suhu">${cuaca[i].t}<sup>&deg;</sup></p>
    </li>`
        }
        document.querySelector('.perkiraan').innerHTML = perkiraanSuhu;
        document.querySelector('.statistik').innerHTML = statistik;
        document.querySelector('.desa').textContent = `${kecamatan}, ${desa}`
        document.querySelector('.waktu').textContent = `${hari[date.getDay()]}, ${formatWaktu(date.getHours())}:${formatWaktu(date.getMinutes())}`;
        document.querySelector('.desc-suhu').innerHTML = `<span>${suhu}<sup>&deg;</sup></span>`;
        document.querySelector('.kondisi').textContent = weather_desc;

        switch (weather_desc) {
            case 'Cerah': {
                document.querySelector('.card-cuaca').style.backgroundImage = `url('./assets/sunny.jpg')`;
                break;
            }
            case 'Berawan': {
                document.querySelector('.card-cuaca').style.backgroundImage = `url('./assets/cloudy.jpg')`;
                break;
            }
            case 'Berawan Tebal': {
                document.querySelector('.card-cuaca').style.backgroundImage = `url('./assets/rainy.jpg')`;
                break;
            }
            case 'Udara Kabur': {
                document.querySelector('.card-cuaca').style.backgroundImage = `url('./assets/rainy.jpg')`;
                break;
            }
            case 'Kabut/Asap': {
                document.querySelector('.card-cuaca').style.backgroundImage = `url('./assets/rainy.jpg')`;
                break;
            }
        }
    }
});

