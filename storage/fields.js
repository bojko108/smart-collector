const fields = {
  pylon: [
    {
      key: 'c_kind',
      title: 'Вид',
      type: 'dropdown',
      value: 'Носещ',
      filterOptions: true,
      options: [
        { value: 'Ъглов', label: 'Ъглов' },
        { value: 'Портален в уредба', label: 'Портален в уредба' },
        { value: 'Двоен портален', label: 'Двоен портален' },
        { value: 'Портален', label: 'Портален' },
        { value: 'Носещ', label: 'Носещ' },
        { value: 'Подпорен', label: 'Подпорен' },
        { value: 'Краен', label: 'Краен' },
        { value: 'Разклонителен', label: 'Разклонителен' },
        { value: 'Опъвателен', label: 'Опъвателен' },
        { value: 'Троен портален', label: 'Троен портален' },
        { value: 'Помощен', label: 'Помощен' },
        { value: 'НЕ МОЖЕ ДА СЕ ОПРЕДЕЛИ', label: 'НЕ МОЖЕ ДА СЕ ОПРЕДЕЛИ' },
        { value: 'НЕ Е ВЪВЕДЕНО', label: 'НЕ Е ВЪВЕДЕНО' }
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
      value: 'Единична',
      filterOptions: true,
      options: [
        { value: 'Единична', label: 'Единична' },
        { value: 'Двойна', label: 'Двойна' },
        { value: 'Тройна', label: 'Тройна' },
        { value: 'Друга', label: 'Друга' },
        { value: 'Четворна', label: 'Четворна' },
        { value: 'Ревизионен отвор-колектор', label: 'Ревизионен отвор-колектор' },
        { value: 'Проходим ревизионен отвор-колектор', label: 'Проходим ревизионен отвор-колектор' },
        { value: 'Чужда', label: 'Чужда' },
        { value: 'НЕ МОЖЕ ДА СЕ ОПРЕДЕЛИ', label: 'НЕ МОЖЕ ДА СЕ ОПРЕДЕЛИ' },
        { value: 'НЕ Е ВЪВЕДЕНО', label: 'НЕ Е ВЪВЕДЕНО' }
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
