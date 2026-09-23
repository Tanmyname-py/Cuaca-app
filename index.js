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
    if (kabupaten) {
        isChange[0] = true;
        const kecamatan = await fetch(`http://localhost:3000/kab?code=${optionKab}`);
        const result = await kecamatan.json();
        result.data?.forEach(d => {
            const option = document.createElement('option');
            option.value = d.code
            option.textContent = d.name;
            inputKecamatan.appendChild(option);
        });
    }

});

inputKecamatan.addEventListener('change', async (e) => {
    if (isChange[1]) {
        inputDesa.innerHTML = `<option value="">Kel/Desa</option>`;
        isChange[1] = false;
    }
    const optionKec = e.target.value;
    if (optionKec) {
        isChange[1] = true;
        const kecamatan = await fetch(`http://localhost:3000/desa?code=${optionKec}`);
        const result = await kecamatan.json();
        result.data.map(d => {
            const option = document.createElement('option');
            option.value = d.code;
            option.textContent = d.name;
            inputDesa.appendChild(option);
        })
    }

});


inputDesa.addEventListener('change', async (e) => {
    const code = e.target.value;
    const cuaca = await fetch(`http://localhost:3000/cuaca?code=${code}`);
    if (cuaca.ok) {
        let result = await cuaca.json();
        const detail = [
            { label: 'Kelembapan', nilai: `${result.data[0].cuaca[0][0].hu}%` },
            { label: 'Angin', nilai: `${result.data[0].cuaca[0][0].ws} km/jam` }
        ]
        const lokasi = document.querySelector('.loc');
        const suhu = document.querySelector('.suhu');
        const desc_cuaca = document.querySelector('.desc-cuaca')
        lokasi.textContent = `${result.lokasi.kecamatan}, ${result.lokasi.desa}`
        suhu.innerHTML = `${result.data[0].cuaca[0][0].t} &deg;`
        desc_cuaca.textContent = result.data[0].cuaca[0][0].weather_desc
        const html = detail.map(d => `
            <li>
            <span class="label">${d.label}</span>
            <span class="nilai">${d.nilai}</span>
            </li>
        `).join("");
        document.querySelector('.detail').innerHTML = html;
        switch (result.data[0].cuaca[0][0].weather_desc) {
            case 'Berawan': {
                document.querySelector('.header-card').style.backgroundImage = `url(./assets/cloudy.jpg)`;
                break
            }
            case 'Cerah Berawan': {
                document.querySelector('.header-card').style.backgroundImage = `url(./assets/sunny.jpg)`;
                break;
            }
            case 'Cerah' : {
                document.querySelector('.header-card').style.backgroundImage = `url(./assets/sunny.jpg)`;
                break;
            }
        }

        document.querySelector('.card-cuaca').classList.add('display')
    }
})

