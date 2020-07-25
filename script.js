const start = 2009
const end = 2020

const computeT1 = (income, pass) => {
  const max = pass.t1.value

  if (income > max) {
    income = max
  }

  return Number(((income / max) * pass.t1.max_points).toFixed(2))
}

const computeT2 = (income, pass, year) => {
  const min = pass.t1.value
  const max = pass.t2.value

  if (income > max) {
    return pass.t2.max_points
  }

  if (year < 2015) {
    if (income <= min) {
      return 0
    }

    return Number((((income - min) * pass.t2.max_points) / (max - min)).toFixed(2))
  }

  return Number(((income / max) * pass.t2.max_points).toFixed(2))
}

const formUpdate = (e) => {
  e.preventDefault()

  const fields = ['income', 'contributions_1', 'contributions_2', 'contributions_3', 'contributions_4']
  let tableInnerHTML = ''
  let total = 0

  for (let year = start; year < end; year++) {
    let subTotal = 0
    for (field of fields) {
      const value = parseInt(formValuesNode[`${year}.${field}`].value || 0, 10)
      values[year][field] = value

      if (['contributions_1', 'contributions_2', 'contributions_3', 'contributions_4'].includes(field)) {
        subTotal += value
      }
    }

    values[year]['contributions_total'] = subTotal
    const income = values[year]['income']

    if (income > 0) {
      const pass = data[year].pass
      const { t1, t2 } = pass
      const t1Value = computeT1(income, pass, year)
      const t2Value = computeT2(income, pass, year)
      const lineTotal = t1Value + t2Value
      total += lineTotal

      tableInnerHTML += `
        <tr>
          <td>${year}</td>
          <td>${income}</td>
          <td>${t1.value}</td>
          <td>${t2.value}</td>
          <td>${t1.max_points}</td>
          <td>${t2.max_points}</td>
          <td>${t1.point_value}</td>
          <td>${t2.point_value}</td>
          <td>${t1Value}</td>
          <td>${t2Value}</td>
          <td>${lineTotal}</td>
        </tr>
      `
    }

    const totalPointNode = document.querySelector('#total-points')
    totalPointNode.innerHTML = total.toFixed(2)
  }

  const tableComputeNode = document.querySelector('#table-compute tbody')
  tableComputeNode.innerHTML = tableInnerHTML
}
const formValuesNode = document.getElementById('form-values')
formValuesNode.addEventListener('change', formUpdate)

const init = () => {
  const formFieldsNode = document.getElementById('form-fields')

  for (let year = start; year < end; year++) {
    const divNode = document.createElement('div')
    divNode.innerHTML = `
      <li>
        <b>${year}</b>
        <label>Chiffre d'affaire<input type="number" name="${year}.income" id="${year}.income" /></label>
        <label>Cotisations T1<input type="number" name="${year}.contributions_1" id="${year}.contributions_1" /></label>
        <label>Cotisations T2<input type="number" name="${year}.contributions_2" id="${year}.contributions_2" /></label>
        <label>Cotisations T3<input type="number" name="${year}.contributions_3" id="${year}.contributions_3" /></label>
        <label>Cotisations T4<input type="number" name="${year}.contributions_4" id="${year}.contributions_4" /></label>
      </li>
    `
    formFieldsNode.appendChild(divNode)
  }
}
init()
