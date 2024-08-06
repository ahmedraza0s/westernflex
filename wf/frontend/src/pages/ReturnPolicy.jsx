import React from 'react';
import './returnPolicy.css';

const ReturnPolicy = () => {
    return (
        <>
        <div className='ReturnPolicy'>
            <h1><center>Our Return Policy</center></h1>
            <section id="Return">
                <div className="returncontent">
                <p>At Western Flex, we strive to ensure our customers are satisfied with their purchases. <br/>You can return products within 5 days of receipt under the following conditions:</p><br/>
                <ul>
                        <li><b>Defective Product:</b> If the product is defective or damaged.</li>
                        <li><b>Wrong Color:</b> If the product is in a different color than ordered.</li>
                        <li><b>Wrong Product:</b> If you received a different product than ordered.</li>
                    </ul>
                    <h1>Important Notes</h1>
                    <ul>
                        <li>Returns are accepted only for products that are defective, the wrong color, or the wrong product.</li>
                        <li>Products must be in their original condition, including all accessories and tags.</li>
                        <li>Return shipping costs will be covered by Western Flex if the return is due to the reasons listed above.</li>
                    </ul>
                </div>
            </section>
            </div>
        </>
    );
};

export default ReturnPolicy;
