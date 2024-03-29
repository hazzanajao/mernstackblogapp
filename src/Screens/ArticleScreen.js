import {useState, useEffect} from "react";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import NotFound from './NotFound';
import CommentList from '../Components/CommentList';
import AddCommentForm from '../Components/AddCommentForm';
import articles from './article-datasource';



function ArticleScreen(){
    const [articleInfo, setArticleInfo] = useState({ upvotes: 0, comments: [] });
    const  { articleId }  = useParams()


    useEffect(() => {
        const loadArticleInfo = async () => {
            const response = await axios.get(`/api/articles/${articleId}`);
            const newArticleInfo = response.data;
            setArticleInfo(newArticleInfo);
        }

        loadArticleInfo();
    }, []);

    const article = articles.find(article => article.name === articleId);

    const addUpvote = async () => {
        const response = await axios.put(`/api/articles/${articleId}/upvote`);
        const updatedArticle = response.data;
        setArticleInfo(updatedArticle);
    }

    if (!article) {
        return <NotFound />
    }

    return (
        <>
            <h1>{article.title}</h1>
            <div className="upvotes-section">
                <button onClick={addUpvote} style={{marginRight:"16px"}}>Upvote</button>
                <p>This article has {articleInfo.upvotes} upvote(s)</p>
            </div>
            {article.content.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
            ))}
            <AddCommentForm
                articleName={articleId}
                onArticleUpdated={updatedArticle => setArticleInfo(updatedArticle)} />

            <CommentList comments={articleInfo.comments} />
        </>
    );
}
export default ArticleScreen
