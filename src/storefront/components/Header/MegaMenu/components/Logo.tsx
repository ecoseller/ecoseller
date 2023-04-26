import React from 'react'
// Utils
import { classNames } from '../utils/css'

interface ILogoProps {
  id: string
  src: string
  className?: string
  rel?: string
  alt?: string
}

const Logo = ({ id, src, rel = '', className, alt = '' }: ILogoProps) => {
  const rootClasses = classNames('rmm__logo', className && className)
  return <img id={id} src={src} className={rootClasses} rel={rel} alt={alt} />
}

export default Logo
