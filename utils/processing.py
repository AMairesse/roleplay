from langchain_core.prompts import ChatPromptTemplate
from langchain_groq import ChatGroq
from langchain.chains import LLMChain

from langchain.prompts import PromptTemplate
from langchain.chains import SequentialChain

from dotenv import load_dotenv

import glob

load_dotenv("./.env")

model="mixtral-8x7b-32768" #GROQAPI
# model="llama3-70b-8192"

class process_chunk():
    def __init__(self,file_path):
        self.file_path=file_path
        self.import_chunks()

        self.audio_resume=[]
        for chunk in self.audio_chunks:
            self.audio_resume.append(self.process_chunk(chunk))
        pass

    def import_chunks(self):
        self.audio_chunks=[]
        # All files and directories ending with .txt and that don't begin with a dot:
        liste_chunks=glob.glob("./"+self.file_path+"/*.txt")
        for chunk in liste_chunks:
            self.audio_chunks.append(open(chunk, "r",encoding='utf-8').read())
        pass

    def process_chunk(self,chunk):
        template ="""
        Contexte: Jeu de rôle type Donjon et Dragon (DnD 3.5).
        Résume la situation suivante pour renseigner le maitre du jeu (MJ) à partir d'un audio. Précise si des sorts ou compétences spécifiques ont été utilisées. Voici le transcript de l'audio:
        {audio_chunk}

        Réponse en 2 phrases. N'invente rien. Réponse en français.
        Réponse au format json:
        Reponse: ( each_acteurs : acteurs[];
        scene: (actions_memorables, informations_importantes );
        lieu: (lieu, interieur_exterieur, jour_nuit);
        )
        acteur : (nom, PJ_PNJ).
        """
        #Réponse au format json (lieu, actions_memorables, informations_importantes):
        prompt = PromptTemplate(
            input_variables=["audio_chunk"],
            template = template                      
        )

        synthese = LLMChain(
            llm=ChatGroq(temperature=0, model=model),# response_format={"type": "json_object", "schema": Resume.model_json_schema()}),
            prompt=prompt,
            output_key="transcript_resume",
            
        )

        overall_chain = SequentialChain(
            chains=[synthese],
            input_variables=["audio_chunk"],
            output_variables=["transcript_resume"],
            verbose=False
        )

        return overall_chain(chunk)['transcript_resume']