const fields = {
  pylon: [
    {
      key: 'c_kind',
      title: 'Вид',
      type: 'dropdown',
      value: 'Nosesht',
      filterOptions: true,
      options: [
        { value: 'Aglov', label: 'Ъглов' },
        { value: 'Portalen v uredba', label: 'Портален в уредба' },
        { value: 'Dvoen portalen', label: 'Двоен портален' },
        { value: 'Portalen', label: 'Портален' },
        { value: 'Nosesht', label: 'Носещ' },
        { value: 'Podporen', label: 'Подпорен' },
        { value: 'Kraen', label: 'Краен' },
        { value: 'Razklonitelen', label: 'Разклонителен' },
        { value: 'Opavatelen', label: 'Опъвателен' },
        { value: 'Troen portalen', label: 'Троен портален' },
        { value: 'Pomoshten', label: 'Помощен' },
        { value: 'NE MOZHE DA SE OPREDELI', label: 'НЕ МОЖЕ ДА СЕ ОПРЕДЕЛИ' },
        { value: 'NE E VAVEDENO', label: 'НЕ Е ВЪВЕДЕНО' }
      ]
    },
    // {
    //   key: 'c_baseType',
    //   title: 'Тип на основата',
    //   type: 'dropdown',
    //   value: 'бетон',
    //   filterOptions: true,
    //   options: [
    //     { value: 'бетон', label: 'бетон' },
    //     { value: 'монолит', label: 'монолит' },
    //     { value: 'блокова', label: 'блокова' },
    //     { value: 'НЕ Е ВЪВЕДЕНО', label: 'НЕ Е ВЪВЕДЕНО' },
    //     { value: 'НЕ МОЖЕ ДА СЕ ОПРЕДЕЛИ', label: 'НЕ МОЖЕ ДА СЕ ОПРЕДЕЛИ' }
    //   ]
    // },
    {
      key: 'c_description',
      title: 'Коментар',
      type: 'text',
      value: null
    }
  ],
  manhole: [
    {
      key: 'c_kind',
      title: 'Вид',
      type: 'dropdown',
      value: 'Edinichna',
      filterOptions: true,
      options: [
        { value: 'Edinichna', label: 'Единична' },
        { value: 'Dvoina', label: 'Двойна' },
        { value: 'Troina', label: 'Тройна' },
        { value: 'Druga', label: 'Друга' },
        { value: 'Chetvorna', label: 'Четворна' },
        { value: 'Revizionen otvor-kolektor', label: 'Ревизионен отвор-колектор' },
        { value: 'Prohodim revizionen otvor-kolektor', label: 'Проходим ревизионен отвор-колектор' },
        { value: 'Chuzhda', label: 'Чужда' },
        { value: 'NE MOZHE DA SE OPREDELI', label: 'НЕ МОЖЕ ДА СЕ ОПРЕДЕЛИ' },
        { value: 'NE E VAVEDENO', label: 'НЕ Е ВЪВЕДЕНО' }
      ]
    },
    {
      key: 'c_description',
      title: 'Коментар',
      type: 'text',
      value: null
    }
  ]
};

export const getPropertiesFor = featureType => {
  return fields[featureType];
};
