import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './aboutUs.css';
import happyCustomer from '../components/assets/happycustomer.jpg';
import visionImg from '../components/assets/ourvision.jpg';
import ourstoryImg from '../components/assets/ourstory.jpg';

const AboutUs = () => {
    const countRef = useRef(null);
    const [isCounting, setIsCounting] = useState(false);

    useEffect(() => {
        // Handle image transitions
        const images = document.querySelectorAll('.imageabout img, .Aboutimage img');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('slide-in');
                } else {
                    entry.target.classList.remove('slide-in');
                }
            });
        }, { threshold: 0.1 });

        images.forEach(image => {
            observer.observe(image);
        });

        // Clean up the observer on unmount
        return () => {
            observer.disconnect();
        };
    }, []);

    useEffect(() => {
        // Handle counting animation
        const startCountAnimation = () => {
            if (countRef.current) {
                let start = 100;
                const end = 10000;
                const duration = 2000;
                const stepTime = 50;
                const stepCount = Math.ceil(duration / stepTime);
                const stepIncrement = (end - start) / stepCount;

                let current = start;
                const interval = setInterval(() => {
                    current += stepIncrement;
                    if (current >= end) {
                        clearInterval(interval);
                        countRef.current.innerText = '10,000+';
                    } else {
                        countRef.current.innerText = Math.floor(current).toLocaleString();
                    }
                }, stepTime);
            }
        };

        const handleScroll = () => {
            const element = countRef.current;
            if (element) {
                const rect = element.getBoundingClientRect();
                if (rect.top < window.innerHeight && rect.bottom >= 0) {
                    if (!isCounting) {
                        setIsCounting(true);
                        startCountAnimation();
                    }
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Check visibility on mount

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [isCounting]);

    return (
        <div className="aboutContainer">
            <h1><center>Welcome to Western Flex</center></h1>
            <p>At Western Flex, we believe that the perfect bag is more than just an accessory; it's a trusted companion for your journey through life. Whether you’re gearing up for a tech-driven day at the office or preparing for an adventurous travel escapade, we’ve got you covered with our diverse range of bags.</p>

            <section id="aboutPage">
                <div className="text">
                    <h1>Our Story</h1>
                    <p className="p1">Founded with a passion for creating high-quality, versatile bags, Western Flex has grown into a trusted name in the industry. Our journey began with a simple goal: to design and manufacture bags that combine functionality, durability, and style. Today, we are proud to offer a wide range of products that cater to every need and occasion.</p>
                </div>
                <div className="imageabout">
                    <img src={ourstoryImg} alt="Our Story" />
                </div>
            </section>

            <section id="aboutUsPage">
                <div className="AboutUs1">
                    <div className="Aboutimage">
                        <img src={visionImg} alt="Our Future" />
                    </div>
                    <div className="Aboutcontent">
                        <h1>Our Vision</h1>
                        <p>Our vision is to be the leading provider of innovative and stylish products that enhance the lives of our customers. We strive to be a brand that is synonymous with quality, reliability, and fashion-forward design.</p>
                    </div>
                </div>
            </section>

            <section id="aboutPage">
                <div className="text">
                    <h1>Happy Customers</h1>
                    <p>At Western Flex, we take pride in our customer satisfaction. Over the years, we have served countless happy customers who love our products and services.</p>
                   
                    <div className="customerCount">
                        <div className="countItem">
                            <h2><span ref={countRef}>100</span></h2>
                            <p><b>Satisfied Customers</b></p>
                        </div>
                    </div>
                </div>
                <div className="imageabout">
                    <img src={happyCustomer} alt="Happy Customers" />
                </div>
            </section>

            <h1><center>Return Policy</center></h1>
            <div className='returnPolicy'>
                <p>To get policy details <Link to="/return-policy">Click Here</Link></p>
            </div>
        </div>
    );
};

export default AboutUs;
