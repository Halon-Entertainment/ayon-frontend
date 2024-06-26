import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

// transform url to mention (if it is a mention)
const urlToMention = (href, options) => {
  if (!href) return { href }
  // check href is a mention
  const type = href && href.split(':')[0]
  // find the type in mention options
  const typeSymbol = Object.entries(options).find(([, value]) => value.id === type)?.[0]
  if (!typeSymbol) return { href }
  // prefix @ to the href
  const newHref = '@' + href
  return { href: newHref, type: typeSymbol }
}

const InputMarkdownConvert = ({ typeOptions, initValue }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      urlTransform={(url) => url}
      components={{
        a: ({ children, href }) => {
          const { href: newHref, type } = urlToMention(href, typeOptions)

          return (
            <a href={newHref}>
              {type}
              {children}
            </a>
          )
        },
        // convert li into check list items
        li: ({ children, ...props }) => {
          if (!props.className?.includes('task-list-item')) return <li {...props}>{children}</li>
          else {
            const p = children.find((item) => item.type === 'p')
            const input = p?.props?.children?.find((item) => item.type === 'input')
            const isChecked = input?.props?.checked

            const checked = isChecked ? 'checked' : 'unchecked'
            return (
              <li data-list={checked} {...props}>
                {children}
              </li>
            )
          }
        },
        code: ({ children, ...props }) => {
          return <pre {...props}>{children}</pre>
        },
      }}
    >
      {initValue}
    </ReactMarkdown>
  )
}

export default InputMarkdownConvert
