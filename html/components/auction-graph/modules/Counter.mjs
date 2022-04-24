import { node } from '/static/html/components/component_modules/hooks/index.mjs'

const useSplitURL = (str) => {
  const [text, setText] = node.useState(str)
  const masked = text.split('.')
  return [masked, setText]
}

export const Counter = () => {
  try {
    const { render, useEffect, useState} = node
    const [count, setCount] = useState(0)
    const [text, setText] = useState('foo')
    const [url, setUrl] = useSplitURL('www.netlify.com')

    useEffect(() => {
      console.log('EFFECT 1 COUNT', count)
    }, [count])

    useEffect(() => {
      console.log('EFFECT 2 URL', url)
    }, [url])

    return {
      url: (url) => {
        setUrl(url)
        return render(Counter)
      },
      click: () => {
        setCount(count + 1)
        return render(Counter)
      },
      type: txt => {
        setText(txt)
        return render(Counter)
      },
      noop: () => setCount(count),
      render: (self) => {
        console.log('RENDER', { count, text }, self)
      }
    }
  } catch (e) {
    console.log('error', e)
  }
}
